#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"

# ── Load nvm if available ─────────────────────────────────────────────────────
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && source "$NVM_DIR/nvm.sh"
command -v nvm &>/dev/null && nvm use 22 --silent

PASS=true

echo "=== Ping Tray Monitor — startup checks ==="
echo ""

# ── .env ─────────────────────────────────────────────────────────────────────
if [ ! -f ".env" ]; then
  echo "[FAIL] .env not found — create one from the example below:"
  echo ""
  echo "  MQTT_BROKER_HOST=<broker ip>"
  echo "  MQTT_BROKER_PORT=1883"
  echo "  MQTT_WS_PORT=9001"
  echo "  MQTT_USERNAME="
  echo "  MQTT_PASSWORD="
  echo "  PROCESS_STATUS=<projectId>/<systemId>"
  echo "  CONNECTION_STATUS=<projectId>/<systemId>"
  echo ""
  PASS=false
else
  echo "[OK]   .env found"

  # Source without exporting (values checked below)
  set -a; source .env; set +a

  # Required keys
  check_var() {
    local name="$1" value="$2" pattern="$3"
    if [ -z "$value" ]; then
      echo "[FAIL] $name is not set in .env"
      PASS=false
    elif [ -n "$pattern" ] && ! echo "$value" | grep -qE "$pattern"; then
      echo "[FAIL] $name has unexpected format: '$value'"
      echo "       Expected: <projectId>/<systemId>"
      PASS=false
    else
      echo "[OK]   $name = $value"
    fi
  }

  check_var "MQTT_BROKER_HOST"  "$MQTT_BROKER_HOST"
  check_var "MQTT_BROKER_PORT"  "$MQTT_BROKER_PORT"
  check_var "PROCESS_STATUS"    "$PROCESS_STATUS"    "^[a-f0-9-]+/[a-f0-9-]+$"
  check_var "CONNECTION_STATUS" "$CONNECTION_STATUS" "^[a-f0-9-]+/[a-f0-9-]+$"
fi

# ── node_modules ──────────────────────────────────────────────────────────────
if [ ! -d "node_modules" ]; then
  echo "[WARN] node_modules not found — running npm install..."
  npm install || { echo "[FAIL] npm install failed"; PASS=false; }
else
  echo "[OK]   node_modules present"
fi

# ── Node version ──────────────────────────────────────────────────────────────
if command -v node &>/dev/null; then
  NODE_VER=$(node --version)
  NODE_MAJOR=$(echo "$NODE_VER" | sed 's/v\([0-9]*\).*/\1/')
  if [ "$NODE_MAJOR" -lt 18 ]; then
    echo "[FAIL] Node $NODE_VER found — version 18+ required"
    PASS=false
  else
    echo "[OK]   Node $NODE_VER"
  fi
else
  echo "[FAIL] node not found — install Node.js 18+"
  PASS=false
fi

# ── Summary ───────────────────────────────────────────────────────────────────
echo ""
if [ "$PASS" = false ]; then
  echo "One or more checks failed. Fix the issues above and try again."
  exit 1
fi

echo "All checks passed. Starting..."
echo ""
npm start
