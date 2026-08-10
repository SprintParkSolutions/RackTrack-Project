#!/usr/bin/env python3
"""Write dist/sitemap.xml and dist/robots.txt for $DOMAIN."""
import glob, os, pathlib, datetime

dom = os.environ['DOMAIN'].rstrip('/')
mode = os.environ.get('MODE', 'flat')
today = datetime.date.today().isoformat()

urls = []
if mode == 'clean':
    urls.append(dom + '/')
    for d in sorted(os.listdir('dist')):
        if os.path.isdir(os.path.join('dist', d)) and os.path.exists(f'dist/{d}/index.html'):
            urls.append(f'{dom}/{d}/')
else:
    for f in sorted(glob.glob('dist/*.html')):
        b = os.path.basename(f)
        urls.append(dom + '/' if b == 'index.html' else f'{dom}/{b}')

body = ''.join(f'  <url><loc>{u}</loc><lastmod>{today}</lastmod></url>\n' for u in urls)
pathlib.Path('dist/sitemap.xml').write_text(
    '<?xml version="1.0" encoding="UTF-8"?>\n'
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + body + '</urlset>\n')
pathlib.Path('dist/robots.txt').write_text(
    f'User-agent: *\nAllow: /\n\nSitemap: {dom}/sitemap.xml\n')
print(f"     sitemap.xml with {len(urls)} urls, robots.txt")
