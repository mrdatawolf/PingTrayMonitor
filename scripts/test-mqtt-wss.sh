#!/usr/bin/env bash
# Usage: scripts/test-mqtt-wss.sh [wss://host:port/path]
# Defaults to wss://mqtt.biztechro.com/ws (port 443, the path GitHub Pages will use)
set -euo pipefail

URL="${1:-wss://mqtt.biztechro.com/ws}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

node "$SCRIPT_DIR/test-mqtt-wss.js" "$URL"
