import asyncio
import requests
import pandas as pd
from playwright.async_api import async_playwright

def enviar_a_backend(productos):
    url = "http://backend_api:3000/productos"
    for producto in productos:
        try:
            if not producto.get("url"): continue
            res = requests.post(url, json=producto)
            print("Enviado:", producto["nombre"], "| Status:", res.status_code)
        except Exception as e:
            print("Error enviando:", e)

async def scrape_falabella_fast():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"
        )
        page = await context.new_page()
        
        print(">>> Navegando a Falabella...")
        search_url = "https://www.falabella.com.co/falabella-co/search?Ntt=thinkpad"
        
        await page.goto(search_url, wait_until="domcontentloaded")
        await page.wait_for_selector("div.grid-pod", timeout=20000)
        
        # Paso 1: Solo sacamos URL y Precio de la lista
        print(">>> Capturando lista de productos...")
        productos_galeria = await page.eval_on_selector_all(
            "div.grid-pod",
            """nodes => nodes.map(n => {
                const link = n.querySelector("a.pod-link")?.href;
                const precioElemento = n.querySelector(".prices-0, .pod-prices")?.querySelector(".primary");
                const precioText = precioElemento ? precioElemento.innerText : null;
                return { url: link, precioRaw: precioText };
            })"""
        )

        results = []

        for index, prod in enumerate(productos_galeria[:15]):
            if not prod['url'] or not prod['precioRaw']: continue
            
            try:
                precio_num = int(''.join(filter(str.isdigit, prod['precioRaw'].split('\\n')[0])))

                print(f"[{index + 1}] Entrando a: {prod['url']}")
                await page.goto(prod['url'], wait_until="domcontentloaded")
                await page.wait_for_selector("h1", timeout=15000)
                
                nombre = await page.inner_text("h1")

                # 🔥 NUEVA LÓGICA DE IMAGEN: Capturar desde la página de detalle
                # Buscamos la imagen principal del carrusel/producto
                imagen_final = await page.evaluate("""() => {
                    // 1. Intentar el selector de imagen principal de Falabella
                    const mainImg = document.querySelector('img.jsx-2487856160, img.main-image, #testId-pod-image, .premium-product-container img');
                    if (mainImg && mainImg.src && !mainImg.src.includes('data:image')) return mainImg.src;

                    // 2. Intentar buscar por el contenedor del carrusel
                    const carouselImg = document.querySelector('.carousel-container img, .product-image-cloudonary img');
                    if (carouselImg && carouselImg.src) return carouselImg.src;

                    // 3. Si falla, buscar la primera imagen grande que no sea un icono
                    const allImgs = Array.from(document.querySelectorAll('img'));
                    const bigImg = allImgs.find(img => img.width > 200 && img.src.includes('falabella'));
                    return bigImg ? bigImg.src : null;
                }""")

                # Si Playwright no la capturó por JS, forzamos captura de atributo directo
                if not imagen_final:
                    imagen_final = await page.get_attribute("picture img", "src")

                # --- Specs ---
                await page.mouse.wheel(0, 800)
                await asyncio.sleep(1)
                
                # Expandir si es necesario
                try:
                    expand = page.get_by_text("Ver todas las especificaciones")
                    if await expand.is_visible(): await expand.click()
                except: pass

                specs = {}
                rows = await page.query_selector_all("tr.jsx-513032616, .specification-table tr")
                for row in rows:
                    key_el = await row.query_selector(".property-name")
                    val_el = await row.query_selector(".property-value")
                    if key_el and val_el:
                        specs[(await key_el.inner_text()).strip()] = (await val_el.inner_text()).strip()

                if imagen_final:
                    url_limpia = imagen_final.split('?')[0].split('/w=')[0].split('/hei=')[0]
                    
                    if url_limpia.startswith('//'):
                        url_limpia = f"https:{url_limpia}"
                    
                    # 🔥 AGREGA ESTO: Falabella requiere parámetros de tamaño al final
                    if 'media.falabella.com' in url_limpia and not url_limpia.endswith(('.jpg', '.png', '.webp')):
                        url_limpia = f"{url_limpia}/w=800,h=800,fit=pad"
                    
                    imagen_final = url_limpia
                    print(f"DEBUG SPECS: {specs}")
                
                results.append({
                    "nombre": nombre.strip(),
                    "precio": precio_num,
                    "tienda": "Falabella",
                    "url": prod['url'],
                    "imagen": imagen_final,
                    "especificaciones": specs
                })

                print(f"   ✓ Capturado: {nombre[:20]}... | Imagen: {'OK' if imagen_final else 'Error'}")
                print(f"DEBUG -> Producto: {nombre[:10]} | Imagen URL: {imagen_final}")
            except Exception as e:
                print(f"   × Error: {e}")

        if results:
            enviar_a_backend(results)
        await browser.close()


if __name__ == "__main__":
    async_run = asyncio.run(scrape_falabella_fast())