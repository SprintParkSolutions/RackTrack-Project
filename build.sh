#!/bin/sh
# Rebuild the stylesheet after ANY markup change.
# The site no longer generates CSS in the browser, so new utility classes
# only exist in racktrack.css if this has been run.
set -e
cd "$(dirname "$0")"
npx --yes tailwindcss@3 -c tailwind.config.js -i tw-input.css -o racktrack.css --minify
# keep the headless-Chrome probe directory in sync; a stale copy there makes
# every measurement wrong in a way that looks like a layout bug
PROBE="/private/tmp/claude-501/-Users-aasritha-Downloads-stitch-racktrack-enterprise-redesign-3/97883345-1b49-48b7-ad56-5fdf9d503b25/scratchpad"
[ -d "$PROBE" ] && cp racktrack.css "$PROBE/" 2>/dev/null || true
echo "racktrack.css rebuilt"
