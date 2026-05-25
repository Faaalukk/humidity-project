# HATCH·OS — Incubator Control UI

ESP32 incubator monitor and control panel. React + Vite frontend, Node.js WebSocket bridge, ESP32-CAM live feed.

## Requirements

- Node.js 18+
- ESP32 device running WebSocket firmware

## Setup

```bash
npm install
```

## Run

**Both servers at once:**
```bash
npm run dev:all
```

**Or separately:**
```bash
# terminal 1 — WebSocket bridge (port 8080)
npm run server

# terminal 2 — frontend dev server (port 5173)
npm run dev
```

Open `http://localhost:5173` in browser.

## Environment

By default the frontend connects to `ws://localhost:8080`. Override with:

```bash
# .env
VITE_WS_URL=ws://192.168.1.x:8080
```

## WebSocket Protocol

### ESP → Server

| Type | Description |
|------|-------------|
| Binary (JPEG) | Camera frame — forwarded to all browser clients |
| `{"type":"identify","client":"camera"}` | Camera client handshake |
| `{"type":"full_status", ...}` | Sensor + device state |

**full_status payload:**
```json
{
  "type": "full_status",
  "temp": 37.4,
  "humi": 58.2,
  "heater": true,
  "fog": false,
  "light": true,
  "motor": false,
  "fan": true,
  "temp_set": 37.5,
  "humi_set": 55.0
}
```

### Browser → ESP

| Type | Description |
|------|-------------|
| `{"type":"identify","client":"web"}` | Sent on connect |
| `{"type":"control","device":"heater","state":true}` | Toggle device |

Devices: `heater`, `fog`, `light`, `motor`, `fan`

## Build

```bash
npm run build
```
