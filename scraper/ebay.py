import asyncio
import requests
import re
from playwright.async_api import async_playwright

def enviar_a_backend(productos):
    url = "http://localhost:3000/productos"
    for producto in productos:
        try:
            if not producto.get("url"): continue
            res = requests.post(url, json=producto, timeout=10)
            print(f"📤 Backend: {producto['nombre'][:30]}... | {res.status_code}")
        except Exception as e:
            print(f"❌ Error backend: {e}")

async def scrape_ebay(limite=5):
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
            locale="en-US",
            timezone_id="America/New_York",
            viewport={"width": 1280, "height": 800},
            extra_http_headers={
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.5",
                "Accept-Encoding": "gzip, deflate, br",
                "Connection": "keep-alive",
                "Upgrade-Insecure-Requests": "1",
                "Sec-Fetch-Dest": "document",
                "Sec-Fetch-Mode": "navigate",
                "Sec-Fetch-Site": "none",
                "Sec-Fetch-User": "?1",
            }
        )
        page = await context.new_page()
        await page.add_init_script("""
            Object.defineProperty(navigator, 'webdriver', {get: () => undefined});
            Object.defineProperty(navigator, 'plugins', {get: () => [1, 2, 3]});
            Object.defineProperty(navigator, 'languages', {get: () => ['en-US', 'en']});
            window.chrome = { runtime: {} };
        """)
        
        results = []

        try:
            print(">>> 🔍 Accediendo a eBay...")
            # Paso 1: entrar primero a la página principal para parecer humano
            await page.goto("https://www.ebay.com", wait_until="domcontentloaded")
            await asyncio.sleep(2)

            # Paso 2: navegar a la búsqueda como si el usuario escribiera
            await page.goto("https://www.ebay.com/sch/i.html?_nkw=thinkpad", wait_until="domcontentloaded")
            await asyncio.sleep(3)

            urls = await page.evaluate("""() => {
                return Array.from(document.querySelectorAll('a'))
                    .map(a => a.href)
                    .filter(h => h.includes('/itm/') && !h.includes('thumbs') && !h.includes('p/'));
            }""")

            urls = list(dict.fromkeys(urls))[:limite]
            print(f">>> ✅ {len(urls)} productos encontrados")

            for i, url in enumerate(urls):
                print(f"\n[{i+1}/{len(urls)}] 👉 {url}")
                try:
                    await page.goto(url, wait_until="domcontentloaded", timeout=40000)
                    await page.wait_for_selector(".x-price-primary", timeout=10000)
                    
                    nombre = await page.locator(".x-item-title__mainTitle").inner_text()
                    
                    # --- PRECIO CON DECIMALES ---
                    precio_raw = await page.locator(".x-price-primary").inner_text()
                    match = re.search(r"(\d+[\.,]\d+)", precio_raw)
                    precio = float(match.group(1).replace(",", "")) if match else 0.0

                    # --- ESPECIFICACIONES (Lógica mejorada para labels/values) ---
                    specs_final = {}
                    # Seleccionamos todas las filas de la tabla de specs
                    rows = await page.locator(".ux-layout-section-evo__row").all()
                    for row in rows:
                        labels = await row.locator(".ux-labels-values__labels").all_inner_texts()
                        values = await row.locator(".ux-labels-values__values").all_inner_texts()
                        for k, v in zip(labels, values):
                            key = k.replace(":", "").strip()
                            # Limpiamos el valor de saltos de línea (como el "Más información")
                            val = v.split('\n')[0].strip()
                            specs_final[key] = val

                    # Imagen
                    imagen = ""
                    try:
                        img_el = page.locator(".ux-image-carousel-item.active img").first
                        imagen = await img_el.get_attribute("src")
                    except: pass

                    results.append({
                        "nombre": nombre.strip(),
                        "precio": precio,
                        "tienda": "eBay",
                        "url": url,
                        "imagen": imagen,
                        "especificaciones": specs_final
                    })
                    print(f"   ✨ Capturado: {precio} | RAM: {specs_final.get('Tamaño de RAM', 'N/D')}")

                except Exception as e:
                    print(f"   ⚠️ Error: {e}")
                
                await asyncio.sleep(2)

        finally:
            await browser.close()
        
        if results: 
            enviar_a_backend(results)

if __name__ == "__main__":
    asyncio.run(scrape_ebay(limite=15))