import asyncio
import requests
import re
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

def limpiar_texto(texto):
    """Elimina emojis y caracteres especiales de una línea"""
    return re.sub(r'[^\w\s\-\.,:/áéíóúÁÉÍÓÚñÑ]', '', texto).strip()

def parsear_specs(descripcion):
    """
    Extrae specs del texto libre de Tecnoclife.
    Ejemplo: '⚡ Intel Core i5 11ª generación – Potente y eficiente'
    → {'Procesador específico txt': 'Intel Core i5 11ª generación'}
    """
    specs = {}
    
    mapeo_patrones = [
        (r'(?:Intel|AMD|Ryzen|Core)[^\n\-–]+', "Procesador específico txt"),
        (r'\d+\s*GB\s*RAM[^\n]*',              "Memoria RAM"),
        (r'\d+\s*GB\s*(?:SSD|HDD|M\.2)[^\n]*', "Capacidad de almacenamiento"),
        (r'Pantalla[^\n\-–]*',                  "Tamaño de la pantalla"),
        (r'Windows\s*\d+[^\n]*',               "Sistema operativo"),
    ]
    
    for patron, key in mapeo_patrones:
        match = re.search(patron, descripcion, re.IGNORECASE)
        if match:
            valor = limpiar_texto(match.group(0))
            if valor and key not in specs:
                specs[key] = valor[:80]  # Limitar longitud

    # Detectar marca
    if "AMD" in descripcion.upper() or "RYZEN" in descripcion.upper():
        specs["Marca procesador"] = "AMD"
    elif "INTEL" in descripcion.upper() or "CORE" in descripcion.upper():
        specs["Marca procesador"] = "Intel"

    return specs

async def scrape_tecnoclife(limite=10):
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"
        )

        await context.route("**/*.{woff,woff2,ttf}", lambda r: r.abort())
        await context.route("**/gtm.js*", lambda r: r.abort())
        await context.route("**/analytics.js*", lambda r: r.abort())

        page = await context.new_page()
        print(">>> Accediendo a Tecnoclife...")

        await page.goto(
            "https://www.tecnoclife.com/category/new-products",
            wait_until="domcontentloaded",
            timeout=60000
        )
        await page.wait_for_selector("a[href*='/product-page/']", timeout=20000)

        print(">>> Scroll para cargar todos los productos...")
        for _ in range(8):
            await page.evaluate("window.scrollBy(0, 800)")
            await asyncio.sleep(0.8)
        await asyncio.sleep(2)

        urls = await page.evaluate("""() => {
            return [...new Set(
                Array.from(document.querySelectorAll('a[href*="/product-page/"]'))
                    .map(a => a.href)
            )];
        }""")

        print(f">>> Encontradas {len(urls)} URLs. Procesando {min(limite, len(urls))}...")
        urls = urls[:limite]
        results = []

        for i, url in enumerate(urls):
            print(f"[{i+1}/{len(urls)}] {url.split('/')[-1][:50]}")
            try:
                await page.goto(url, wait_until="domcontentloaded", timeout=30000)
                await page.wait_for_selector("h1", timeout=15000)
                await asyncio.sleep(2)

                # Nombre — limpiar emojis
                nombre_raw = await page.inner_text("h1")
                nombre = limpiar_texto(nombre_raw) or nombre_raw.strip()

                # Precio — selector correcto del HTML
                precio = 0
                try:
                    await page.wait_for_selector(".font_7.wixui-rich-text__text", timeout=5000)
                    precio_raw = await page.locator(".font_7.wixui-rich-text__text").first.inner_text()
                    # Formato: "1.600.000,00 COP" → solo dígitos
                    solo_digitos = re.sub(r'[^\d]', '', precio_raw.split(',')[0])
                    precio = int(solo_digitos) if solo_digitos else 0
                except:
                    pass

                # Imagen — obtener URL base del PNG sin parámetros de Wix
                imagen = ""
                try:
                    await page.wait_for_selector("[data-hook='gallery-item-image-img']", timeout=8000)
                    imagen = await page.evaluate("""() => {
                        const img = document.querySelector('[data-hook="gallery-item-image-img"]');
                        if (!img) return '';
                        const src = img.src || '';
                        // Extraer solo la URL base del archivo .png antes de /v1/
                        // Ejemplo: https://static.wixstatic.com/media/545c71_abc~mv2.png/v1/fit/...
                        // → https://static.wixstatic.com/media/545c71_abc~mv2.png
                        const match = src.match(/(https:\\/\\/static\\.wixstatic\\.com\\/media\\/[^/]+)/);
                        return match ? match[1] : src;
                    }""")
                except:
                    pass

                # Descripción/Specs — selector correcto del HTML
                specs = {}
                try:
                    await page.wait_for_selector(
                        ".CollapsibleTextcomponent2568482278__text, [data-hook='product-description']",
                        timeout=5000
                    )
                    desc = await page.locator(
                        ".CollapsibleTextcomponent2568482278__text, [data-hook='product-description']"
                    ).first.inner_text()
                    
                    print(f"   DESC: {desc[:80]}...")
                    specs = parsear_specs(desc)
                except:
                    pass

                if not specs:
                    specs = {"Estado": "Usado - Tecnoclife"}

                results.append({
                    "nombre": nombre,
                    "precio": precio,
                    "tienda": "Tecnoclife",
                    "url": url,
                    "imagen": imagen,
                    "especificaciones": specs
                })
                print(f"   ✓ {nombre[:40]} | ${precio:,} | Img: {'OK' if imagen else 'No'} | Specs: {len(specs)}")

            except Exception as e:
                print(f"   ⚠️ Error: {e}")

            await asyncio.sleep(1)

        await browser.close()

        if results:
            enviar_a_backend(results)
            print(f"\n>>> ✅ {len(results)} productos enviados.")
        else:
            print("\n>>> ⚠️ No se extrajo ningún producto.")

if __name__ == "__main__":
    asyncio.run(scrape_tecnoclife(limite=20))