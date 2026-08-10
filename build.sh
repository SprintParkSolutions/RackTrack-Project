#!/bin/sh
# Rebuild the stylesheet after ANY markup change.
# The site no longer generates CSS in the browser, so new utility classes
# only exist in racktrack.css if this has been run.
set -e
cd "$(dirname "$0")"
npx --yes tailwindcss@3 -c tailwind.config.js -i tw-input.css -o racktrack.css --minify
echo "racktrack.css rebuilt"
