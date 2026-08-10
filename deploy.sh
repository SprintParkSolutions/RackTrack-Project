#!/bin/sh
# Build a folder that can be uploaded to cPanel as-is.
#
#   ./deploy.sh
#
# Produces  dist/                the files to upload
#           racktrack-site.zip   the same thing zipped, for File Manager
#
# Only what the site serves goes in: the pages, the built stylesheet and
# assets/. node_modules, media/, docs/, tools/ and the build config stay out.

set -e
cd "$(dirname "$0")"

echo "1/3  rebuilding the stylesheet"
./build.sh >/dev/null

echo "2/3  assembling dist/"
rm -rf dist racktrack-site.zip
mkdir -p dist
cp *.html dist/
cp racktrack.css dist/
cp -R assets dist/assets

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

# Send a missing page to the home page rather than a server error page
ErrorDocument 404 /index.html
EOF

echo "3/3  zipping"
( cd dist && zip -qr ../racktrack-site.zip . -x '.DS_Store' )

echo
echo "dist/ ready - $(find dist -type f | wc -l | tr -d ' ') files, $(du -sh dist | cut -f1)"
echo "racktrack-site.zip - $(du -h racktrack-site.zip | cut -f1)"
