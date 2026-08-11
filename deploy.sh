#!/bin/sh
# Build a folder that can be uploaded to cPanel.
#
#   ./deploy.sh
#       flat URLs   ->  /about-us.html
#
#   ./deploy.sh --clean-urls --domain=https://racktrack.ai
#       nested URLs ->  /about-us/        (matches the current live site)
#       and writes sitemap.xml + robots.txt for that domain
#
# Produces  dist/                the files to upload
#           racktrack-site.zip   the same thing zipped, for File Manager
#
# Only what the site serves goes in: pages, the built stylesheet, assets/.
# node_modules, media/, docs/, tools/ and the build config stay out.

set -e
cd "$(dirname "$0")"

MODE="flat"
DOMAIN=""
for a in "$@"; do
  case "$a" in
    --clean-urls) MODE="clean" ;;
    --domain=*)   DOMAIN="${a#--domain=}" ;;
  esac
done

echo "1/4  rebuilding the stylesheet"
./build.sh >/dev/null

echo "2/4  assembling dist/  (mode: $MODE)"
rm -rf dist racktrack-site.zip
mkdir -p dist
cp *.html dist/
cp racktrack.css dist/
cp -R assets dist/assets

if [ "$MODE" = "clean" ]; then
  echo "     nesting pages so URLs stay /page/ rather than /page.html"
  python3 tools/nest-urls.py
fi

echo "3/4  .htaccess, sitemap, robots"
cat > dist/.htaccess <<'HTACCESS'
# RackTrack - static site

DirectoryIndex index.html

# The previous site had /WhyRackTrack/; keep those links alive
RedirectMatch 301 ^/WhyRackTrack/?$ /why-racktrack/

# Compress text assets
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript image/svg+xml
</IfModule>

# Cache what carries a stable name; keep HTML fresh
<IfModule mod_headers.c>
  # the stylesheet has a stable filename, so it must never be cached
  <FilesMatch "\\.css$">
    Header set Cache-Control "no-cache, must-revalidate"
  </FilesMatch>
</IfModule>

<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/css    "access plus 0 seconds"
  ExpiresByType font/woff2  "access plus 1 year"
  ExpiresByType image/jpeg  "access plus 30 days"
  ExpiresByType image/png   "access plus 30 days"
  ExpiresByType text/html   "access plus 0 seconds"
</IfModule>
HTACCESS

if [ -n "$DOMAIN" ]; then
  DOMAIN="$DOMAIN" MODE="$MODE" python3 tools/write-sitemap.py
else
  echo "     no --domain given, so no sitemap.xml written"
fi

echo "4/4  zipping"
( cd dist && zip -qr ../racktrack-site.zip . -x '.DS_Store' )

echo
echo "dist/ ready - $(find dist -type f | wc -l | tr -d ' ') files, $(du -sh dist | cut -f1)"
echo "racktrack-site.zip - $(du -h racktrack-site.zip | cut -f1)"
