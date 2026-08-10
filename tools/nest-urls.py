#!/usr/bin/env python3
"""Turn dist/page.html into dist/page/index.html and rewrite links to /page/."""
import glob, os, pathlib, re

pages = [os.path.basename(f) for f in glob.glob('dist/*.html')]
slugs = [p[:-5] for p in pages if p != 'index.html']

def rewrite(html, depth):
    """depth 0 = site root, 1 = inside /slug/"""
    def page_link(m):
        attr, slug, frag = m.group(1), m.group(2), m.group(3) or ''
        if slug == 'index':
            return f'{attr}="{"../" if depth else "index.html"}{frag}"'
        return f'{attr}="{"../" if depth else ""}{slug}/{frag}"'
    html = re.sub(r'(href)="([A-Za-z0-9_-]+)\.html(#[^"]*)?"', page_link, html)
    if depth:
        html = html.replace('href="racktrack.css"', 'href="../racktrack.css"')
        html = html.replace('src="assets/', 'src="../assets/').replace('href="assets/', 'href="../assets/')
    return html

root = pathlib.Path('dist/index.html')
root.write_text(rewrite(root.read_text(), 0))
for slug in slugs:
    src = pathlib.Path('dist') / f'{slug}.html'
    d = pathlib.Path('dist') / slug
    d.mkdir(exist_ok=True)
    (d / 'index.html').write_text(rewrite(src.read_text(), 1))
    src.unlink()
print(f"     {len(slugs)} pages nested")
