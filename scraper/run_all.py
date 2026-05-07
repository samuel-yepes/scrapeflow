import subprocess
import sys
import os

scrapers = [
    "falabella.py",
    "lenovo.py",
    "ebay.py",
    "tecnolife.py",
]

for scraper in scrapers:
    print(f"\n{'='*40}")
    print(f"Ejecutando: {scraper}")
    print('='*40)
    
    result = subprocess.run(
        [sys.executable, scraper],
        capture_output=False  # muestra el output en tiempo real
    )
    
    if result.returncode != 0:
        print(f"❌ Error en {scraper}")
    else:
        print(f"✅ {scraper} terminó correctamente")

print("\n✅ Todos los scrapers terminaron")