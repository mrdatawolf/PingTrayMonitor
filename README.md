# PingTrayMonitor

A lightweight system-tray app for monitoring connection and process health via MQTT. Sits quietly in your taskbar and turns red the moment something goes wrong.

![Status: green / yellow / red](https://img.shields.io/badge/status-tray%20icon-blue)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## Features

- **Tray icon color** reflects overall health at a glance — green, yellow, red, or grey (connecting)
- **Connection monitoring** — tracks ping agents publishing latency, packet loss, and last-seen timestamps; ages into yellow then red when reports go stale
- **Process monitoring** — displays pipeline/process status from MQTT status topics; sends desktop notifications on state changes
- **MQTT broker support** — connects to any standard MQTT broker with optional username/password auth
- **Multi-source** — configure multiple project/system sources, each independently tracked
- **Remove stale entries** — clear ghost monitors that are no longer publishing

## Screenshots

> Add screenshots here.

## Requirements

- Node.js 18+
- An MQTT broker (e.g. Mosquitto, EMQX, HiveMQ)
- Ping/process agents publishing JSON payloads to the expected topics

## Installation

```bash
git clone https://github.com/youruser/PingTrayMonitor.git
cd PingTrayMonitor
npm install
```

## Running in Development

```bash
npm start
# or on Windows:
start.bat
```

## Building

```bash
npm run make
```

Output installers are placed in `dist/`.

## Configuration

Open the app and click the gear icon to configure:

| Field | Description |
|---|---|
| **MQTT Host** | Broker hostname or IP |
| **MQTT Port** | Broker port (default: 1883) |
| **Username / Password** | Optional broker credentials |
| **Sources** | One or more `projectId/systemId` pairs with a label and type |

Settings are persisted to the OS user-data directory (`app.getPath('userData')`).

### Source Types

| Type | Topic pattern | Behavior |
|---|---|---|
| `connection_status` | `{projectId}/{systemId}/checks/+` | Monitors latency/packet-loss; ages yellow → red when stale |
| `process_status` | `{projectId}/{systemId}/status` | Displays pipeline status directly; sends desktop notification on change |

### Expected Payload Schemas

**connection_status**
```json
{
  "id": "host-identifier",
  "label": "My Server",
  "available": true,
  "latencyMs": 12.4,
  "packetLoss": 0,
  "lastReceived": "2024-01-01T00:00:00.000Z",
  "refreshMinutes": 1
}
```

**process_status**
```json
{
  "status": "green",
  "detail": "All jobs completed successfully"
}
```

`status` values: `green`, `yellow`, `red`

### Staleness Logic (connection_status)

| Age vs. refresh interval | Tray color |
|---|---|
| < 3× refreshMinutes | Green |
| 3×–5× refreshMinutes | Yellow |
| > 5× refreshMinutes | Red |

## Tech Stack

- [Electron](https://www.electronjs.org/) + [Electron Forge](https://www.electronforge.io/)
- [React 18](https://react.dev/) + [Zustand](https://github.com/pmndrs/zustand)
- [Ant Design](https://ant.design/)
- [MQTT.js](https://github.com/mqttjs/MQTT.js)
- [Vite](https://vitejs.dev/)

## License

[MIT](LICENSE)
