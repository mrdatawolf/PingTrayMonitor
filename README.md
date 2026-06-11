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
- **Trend indicators** — flags a connection that flapped or saw packet loss recently with a small badge, even if it's green right now
- **Issues-only focus mode** — by default, hides green/stable checks (and fully-healthy multi-location subjects or source sections) so degraded or down items aren't buried; one switch reveals everything
- **Multi-location connection checks** — groups checks of the same circuit/host reported from multiple sites into one subject, so a real outage can be told apart from a localized path issue
- **Remove stale entries** — clear ghost monitors that are no longer publishing, individually or via an automatic "stale entries" review-and-bulk-clean prompt for entries with no update in 24h+

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
  "refreshMinutes": 1,
  "transitions1h": 0,
  "rollingPacketLoss10": 0
}
```

`transitions1h` and `rollingPacketLoss10` are optional trend fields — the
number of up/down flips in the last hour, and the rolling packet-loss
percentage over the last 10 checks. When either is non-zero, a small
lightning-bolt badge appears on the row even if the check is currently
green, so a connection that's up right now but was unstable recently
doesn't look silently fine.

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

### Multi-Location Connection Checks (`connections/#`)

For a circuit or host that's checked from more than one site (e.g. a WAN
link monitored independently from each branch that depends on it), agents
publish to a broker-wide topic tree:

```
connections/<subjectId>/<projectId>/<systemId>/<id>
```

This is subscribed to automatically and isn't tied to any configured
source — every location publishes its own check of the same `subjectId`.

**Payload** — same shape as `connection_status`, plus `subjectId` /
`subjectLabel`:

```json
{
  "subjectId": "circuit-123",
  "subjectLabel": "Branch A <-> HQ Circuit",
  "id": "checked-from-branch-a",
  "label": "From Branch A",
  "available": true,
  "latencyMs": 12.4,
  "packetLoss": 0,
  "lastReceived": "2024-01-01T00:00:00.000Z",
  "refreshMinutes": 1
}
```

The status panel groups items by `subjectId` into their own section at the
top, with a subject-level dot summarizing all locations:

| Down locations | Subject status | Meaning |
|---|---|---|
| 0 | Green | All locations report it up |
| ≤ 50% | Orange | Likely a path issue local to those reporting locations, not the circuit itself |
| > 50% | Red | Majority down — likely the circuit/subject itself is down |

Orange folds into yellow for the overall tray icon and header dot — only a
majority-down subject (red) is treated as a full outage. If every location
is currently up but one or more flapped recently, the subject shows an
"Up now, but N of M locations flapped recently" note instead.

### Stale Entry Cleanup

If an entry's underlying check hasn't reported in over 24 hours, it's
flagged as a "stale" entry — most likely a decommissioned source whose last
report (or retained message) is just sitting around. A banner appears at
the top of the status view:

> ⚠ N stale entries haven't reported in over a day — Review & Clean

Clicking it opens a review list with each stale entry pre-checked. Uncheck
any you want to keep, then click "Remove Selected" to clear them in one
batch — this clears their retained MQTT message (so they won't reappear on
reconnect) and moves them to the **Blocked Items** panel, where they can be
restored at any time.

## Tech Stack

- [Electron](https://www.electronjs.org/) + [Electron Forge](https://www.electronforge.io/)
- [React 18](https://react.dev/) + [Zustand](https://github.com/pmndrs/zustand)
- [Ant Design](https://ant.design/)
- [MQTT.js](https://github.com/mqttjs/MQTT.js)
- [Vite](https://vitejs.dev/)

## License

[MIT](LICENSE)
