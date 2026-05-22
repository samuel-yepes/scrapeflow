import subprocess
import sys

scrapers = [
    "scraper/falabella.py",
    "scraper/lenovo.py",
    "scraper/ebay.py",
    "scraper/tecnolife.py",
]

for scraper in scrapers:
    print(f"\n{'='*40}")
    print(f"Ejecutando: {scraper}")
    print('='*40)

    result = subprocess.run(
        [sys.executable, scraper],
        capture_output=False
    )

    if result.returncode != 0:
        print(f"❌ Error en {scraper}")
    else:
        print(f"✅ {scraper} terminó correctamente")

print("\n✅ Todos los scrapers terminaron")