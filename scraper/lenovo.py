import asyncio
import requests
from playwright.async_api import async_playwright

def enviar_a_backend(productos):
    url = "https://scrapeflow-sm3v.onrender.com/productos"
    for producto in productos:
        try:
            if not producto.get("url"): continue
            res = requests.post(url, json=producto)
            print(f"Enviado: {producto['nombre'][:30]} | Status: {res.status_code}")
        except Exception as e:
            print(f"Error enviando a backend: {e}")

async def scrape_lenovo(limite=15):
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"
        )
        page = await context.new_page()

        print(f">>> Navegando a Lenovo Colombia...")
        search_url = "https://www.lenovo.com/co/es/search?fq=&text=thinkpad&rows=20"
        
        await page.goto(search_url, wait_until="load", timeout=60000)
        await asyncio.sleep(5)

        # --- LÓGICA PARA CARGAR MÁS PRODUCTOS ---
        print(">>> Buscando más resultados...")
        for _ in range(3):  # 20 → 40 → 53
            try:
                boton = page.locator("button.pc_more")
                if await boton.is_visible(timeout=5000):
                    await boton.click()
                    print("    ... Click en 'Cargar más'")
                    await asyncio.sleep(3)
                else:
                    break
            except:
                break

        # --- CAPTURA DE URLS ÚNICAS (EVITA DUPLICADOS) ---
        # Usamos un Set en JavaScript para que no repita enlaces de imagen/título/botón
        urls_capturadas = await page.eval_on_selector_all(
            "li[data-dlp-url*='/portatiles/']",
            """nodes => [...new Set(nodes.map(n => {
                const path = n.getAttribute('data-dlp-url');
                return path ? 'https://www.lenovo.com/co/es' + path : null;
            }).filter(Boolean))]"""
        )
        
        # Filtrar solo portátiles (evitar accesorios si es posible) y limitar
        productos_reales = [url for url in urls_capturadas if "/p/portatiles/" in url][:limite]
        print(f">>> Encontrados {len(productos_reales)} portátiles únicos.")
        
        results = []

        for index, url in enumerate(productos_reales):
            try:
                print(f"[{index + 1}/{len(productos_reales)}] Procesando: {url}")
                await page.goto(url, wait_until="domcontentloaded", timeout=45000)
                await asyncio.sleep(2)

                # Si es página de galería, entrar al primero
                ver_modelos = page.locator("text=Ver Modelos, text=Configurar, .button-v2.configurator")
                if await ver_modelos.count() > 0:
                    await ver_modelos.first.click()
                    await page.wait_for_load_state("domcontentloaded")
                    await asyncio.sleep(2)

                nombre = await page.inner_text("h1")
                
                # Precio
                try:
                    precio_raw = await page.locator(".final-price, .saleprice, .price-title").first.inner_text()
                    precio_num = int(''.join(filter(str.isdigit, precio_raw)))
                except: precio_num = 0

                # Imagen
                imagen_final = await page.evaluate("""() => {
                    const img = document.querySelector(".main-image-container img, .canvas-item img, .current-image img");
                    return img ? img.src : null;
                }""")

                # Specs
                specs = {}
                rows = await page.query_selector_all(".specs_item, .techSpecs-table tr, .systemSpecs-table tr")
                for row in rows:
                    key_el = await row.query_selector(".item_name, .techSpecs-table-label, td:first-child")
                    val_el = await row.query_selector(".item_content, .techSpecs-table-value, td:last-child")
                    if key_el and val_el:
                        key = (await key_el.inner_text()).replace(":", "").strip()
                        val = (await val_el.inner_text()).strip()
                        specs[key] = val

                # Normalización para tu Front (LenovoView.tsx)
                mapeo = {
                    "Procesador": "Procesador específico txt",
                    "Memoria total": "Memoria RAM",
                    "Unidad de disco primaria": "Capacidad de almacenamiento",
                    "Tipo de pantalla": "Tamaño de la pantalla"
                }

                specs_final = {mapeo.get(k, k): v for k, v in specs.items()}
                
                # Detectar marca para el Front
                if "AMD" in nombre.upper(): specs_final["Marca procesador"] = "AMD"
                elif "INTEL" in nombre.upper(): specs_final["Marca procesador"] = "Intel"

                results.append({
                    "nombre": nombre.strip(),
                    "precio": precio_num,
                    "tienda": "Lenovo",
                    "url": page.url,
                    "imagen": imagen_final,
                    "especificaciones": specs_final
                })

            except Exception as e:
                print(f"   × Error en producto {index + 1}")

        if results:
            enviar_a_backend(results)
        
        await browser.close()

if __name__ == "__main__":
    asyncio.run(scrape_lenovo(limite=25))