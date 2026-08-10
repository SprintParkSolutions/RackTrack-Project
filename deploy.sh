#!/bin/sh
# Build a folder that can be uploaded to cPanel.
#
#   ./deploy.sh                 flat  ->  /about-us.html
#   ./deploy.sh --clean-urls    nested ->  /about-us/     (matches the live site)
#
# Produces  dist/                the files to upload
#           racktrack-site.zip   the same thing zipped, for File Manager
#
# Only what the site serves goes in: the pages, the built stylesheet and
# assets/. node_modules, media/, docs/, tools/ and the build config stay out.

set -e
cd "$(dirname "$0")"

MODE="flat"
[ "$1" = "--clean-urls" ] && MODE="clean"

echo "1/3  rebuilding the stylesheet"
./build.sh >/dev/null

echo "2/3  assembling dist/  (mode: $MODE)"
rm -rf dist racktrack-site.zip
mkdir -p dist
cp *.html dist/
cp racktrack.css dist/
cp -R assets dist/assets

if [ "$MODE" = "clean" ]; then
  echo "     nesting pages so URLs stay /page/ rather than /page.html"
  python3 - <<'PY'
import glob, os, pathlib, re

pages = [os.path.basename(f) for f in glob.glob('dist/*.html')]
slugs = [p[:-5] for p in pages if p != 'index.html']

def rewrite(html, depth):
    """depth 0 = site root, 1 = inside /slug/"""
    up = '../' if depth else ''
    # links to other pages become directory URLs
    def page_link(m):
        attr, slug, frag = m.group(1), m.group(2), m.group(3) or ''
        if slug == 'index':
            return f'{attr}="{up if depth else ""}{"" if depth else "index.html"}{frag}"' if not depth else f'{attr}="../{frag}"'
        return f'{attr}="{up}{slug}/{frag}"'
    html = re.sub(r'(href)="([A-Za-z0-9_-]+)\.html(#[^"]*)?"', page_link, html)
    if depth:
        html = html.replace('href="racktrack.css"', 'href="../racktrack.css"')
        html = html.replace('src="assets/', 'src="../assets/').replace('href="assets/', 'href="../assets/')
    return html

# root index
root = pathlib.Path('dist/index.html')
root.write_text(rewrite(root.read_text(), 0))

# every other page moves into its own directory
for slug in slugs:
    src = pathlib.Path('dist') / f'{slug}.html'
    d = pathlib.Path('dist') / slug
    d.mkdir(exist_ok=True)
    (d / 'index.html').write_text(rewrite(src.read_text(), 1))
    src.unlink()
print(f"     {len(slugs)} pages nested")
PY
fi

cat > dist/.htaccess <<'EOF'
# RackTrack - static site

DirectoryIndex index.html

# Compress text assets
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript image/svg+xml
</IfModule>

# Cache the things that carry a stable name; keep HTML fresh
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/css   "access plus 7 days"
  ExpiresByType image/jpeg "access plus 30 days"
  ExpiresByType image/png  "access plus 30 days"
  ExpiresByType text/html  "access plus 0 seconds"
</IfModule>
EOF

echo "3/3  zipping"
( cd dist && zip -qr ../racktrack-site.zip . -x '.DS_Store' )

echo
echo "dist/ ready - $(find dist -type f | wc -l | tr -d ' ') files, $(du -sh dist | cut -f1)"
echo "racktrack-site.zip - $(du -h racktrack-site.zip | cut -f1)"
