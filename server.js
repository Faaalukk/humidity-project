import { createServer } from 'http';
import { WebSocketServer } from 'ws';

const PORT = parseInt(process.env.PORT ?? '8080', 10);

const httpServer = createServer();

// control channel  →  /ws
const controlWss = new WebSocketServer({ noServer: true });

// camera channel   →  /ws/camera
const cameraWss = new WebSocketServer({ noServer: true });

httpServer.on('upgrade', (req, socket, head) => {
  if (req.url === '/ws/camera') {
    cameraWss.handleUpgrade(req, socket, head, ws => {
      cameraWss.emit('connection', ws, req);
    });
  } else if (req.url === '/ws') {
    controlWss.handleUpgrade(req, socket, head, ws => {
      controlWss.emit('connection', ws, req);
    });
  } else {
    socket.destroy();
  }
});

// ── control channel ──────────────────────────────────────────────────────────
let espSocket = null;

controlWss.on('connection', (ws, req) => {
  const ip = req.socket.remoteAddress;
  console.log(`[CTL] connect    ${ip}`);

  ws.on('message', (raw, isBinary) => {
    if (isBinary) return; // binary belongs on camera channel

    let msg;
    try { msg = JSON.parse(raw); } catch { return; }

    console.log(`[CTL] json       ${ip} —`, msg);

    if (msg.type === 'identify') {
      console.log(`[CTL] identify   ${ip} — client: ${msg.client}`);
      if (msg.client === 'esp' || msg.client === 'camera') espSocket = ws;
      for (const client of controlWss.clients) {
        if (client !== ws && client.readyState === 1) client.send(raw.toString());
      }
    } else if (msg.type === 'full_status') {
      espSocket = ws;
      for (const client of controlWss.clients) {
        if (client !== ws && client.readyState === 1) client.send(raw.toString());
      }
    } else if (msg.type === 'control' || msg.type === 'setting') {
      if (espSocket?.readyState === 1) {
        espSocket.send(raw.toString());
      } else {
        console.warn('[CTL] ESP not connected — dropped:', msg);
      }
    } else if (msg.type === 'ping') {
      ws.send(JSON.stringify({ type: 'pong' }));
    }
  });

  ws.on('close', () => {
    console.log(`[CTL] disconnect ${ip}`);
    if (ws === espSocket) espSocket = null;
  });

  ws.on('error', err => console.error('[CTL] error', err.message));
});

// ── camera channel ───────────────────────────────────────────────────────────
cameraWss.on('connection', (ws, req) => {
  const ip = req.socket.remoteAddress;
  console.log(`[CAM] connect    ${ip}`);

  ws.on('message', (raw, isBinary) => {
    if (!isBinary) return; // only forward binary frames
    for (const client of cameraWss.clients) {
      if (client !== ws && client.readyState === 1) {
        client.send(raw, { binary: true });
      }
    }
  });

  ws.on('close', () => console.log(`[CAM] disconnect ${ip}`));
  ws.on('error', err => console.error('[CAM] error', err.message));
});

httpServer.listen(PORT, () => {
  console.log(`WS bridge listening on :${PORT}  (control: /ws  camera: /ws/camera)`);
});
