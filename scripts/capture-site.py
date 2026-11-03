import concurrent.futures
import hashlib
import html
import json
import re
from pathlib import Path
from urllib.parse import urljoin, urlsplit
from urllib.request import Request, urlopen
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
ORIGIN = 'https://www.odysseeclinic.com.au'
ASSETS = ROOT / 'public' / 'site-assets'
PAGES = ROOT / 'site-content'
ASSETS.mkdir(parents=True, exist_ok=True)
PAGES.mkdir(exist_ok=True)

def fetch(url):
    with urlopen(Request(url, headers={'User-Agent': 'Mozilla/5.0'}), timeout=60) as response:
        return response.read()

routes = ['/', '/about', '/treatments', '/concerns', '/privacy-policy', '/terms-of-use']
pages = {}
assets = set()
media = set()
for route in routes:
    text = fetch(ORIGIN + route).decode()
    pages[route] = text
    soup = BeautifulSoup(text, 'html.parser')
    for tag in soup.find_all(['script', 'link', 'img', 'video', 'source']):
        for key in ['href', 'src', 'poster']:
            url = tag.get(key, '')
            if url.startswith('/_next/static/'):
                assets.add(urlsplit(url).path)
            elif url.startswith('https://cdn.sanity.io/') or url.startswith('https://image.mux.com/'):
                media.add(url)
    print('Captured page', route, flush=True)

completed = set()
while assets - completed:
    batch = sorted(assets - completed)
    def asset(path):
        data = fetch(ORIGIN + path)
        destination = ASSETS / 'next' / path.removeprefix('/_next/static/')
        destination.parent.mkdir(parents=True, exist_ok=True)
        if path.endswith(('.js', '.css')):
            text = data.decode()
            for match in re.findall(r'(?:/_next/static/|static/)?((?:chunks|media)/[^\s\"\'<>\\()]+\.(?:js|css|woff2?|otf|ttf))', text):
                assets.add('/_next/static/' + match)
            if path.endswith('.css'):
                for url in re.findall(r'url\([\"\']?([^\)\"\']+)', text):
                    if not url.startswith('data:'):
                        assets.add(urlsplit(urljoin(ORIGIN + path, url)).path)
            text = text.replace('/_next/static/', '/site-assets/next/')
            data = text.encode()
        destination.write_bytes(data)
        completed.add(path)
        return path
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
        for path in pool.map(asset, batch):
            print('Captured asset', path, flush=True)

inventory = []
def image(url):
    ext = '.webp' if 'image.mux.com' in url else '.jpg'
    filename = 'media/' + hashlib.sha256(url.encode()).hexdigest()[:20] + ext
    destination = ASSETS / filename
    destination.parent.mkdir(exist_ok=True)
    try:
        destination.write_bytes(fetch(url))
        return {'source': url, 'local': '/site-assets/' + filename}
    except Exception as error:
        return {'source': url, 'error': str(error)}
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
    inventory = list(pool.map(image, sorted(media)))

for route, text in pages.items():
    text = text.replace('/_next/static/', '/site-assets/next/')
    text = text.replace('<head>', '<head><script src="/site-assets/navigation.js"></script>')
    filename = 'index.html' if route == '/' else route.strip('/') + '.html'
    (PAGES / filename).write_text(text)
(ROOT / 'site-content' / 'manifest.json').write_text(json.dumps({'origin': ORIGIN, 'routes': routes, 'assets': sorted(completed), 'media': inventory}, indent=2))
print('Capture complete:', len(pages), 'pages,', len(completed), 'bundles/fonts,', len(inventory), 'images/posters', flush=True)
