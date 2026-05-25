import { WebSocketServer } from 'ws';

const PORT = parseInt(process.env.PORT ?? '8080', 10);
const wss = new WebSocketServer({ port: PORT });

let espSocket = null;

wss.on('connection', (ws, req) => {
  const ip = req.socket.remoteAddress;
  console.log(`[WS] connect    ${ip}`);

  ws.on('message', (raw, isBinary) => {
    if (isBinary) {
      console.log(`[WS] binary     ${ip} — ${raw.length} bytes`);
      // forward camera frame to all browser clients
      for (const client of wss.clients) {
        if (client !== ws && client.readyState === 1) {
          client.send(raw, { binary: true });
        }
      }
      return;
    }

    let msg;
    try { msg = JSON.parse(raw); } catch { return; }

    console.log(`[WS] json       ${ip} —`, msg);

    if (msg.type === 'identify') {
      console.log(`[WS] identify   ${ip} — client: ${msg.client}`);
      if (msg.client === 'camera') espSocket = ws;
      // forward identify to all other clients
      for (const client of wss.clients) {
        if (client !== ws && client.readyState === 1) {
          client.send(raw.toString());
        }
      }
    } else if (msg.type === 'full_status') {
      espSocket = ws;
      for (const client of wss.clients) {
        if (client !== ws && client.readyState === 1) {
          client.send(raw.toString());
        }
      }
    } else if (msg.type === 'control' || msg.type === 'setting') {
      if (espSocket?.readyState === 1) {
        espSocket.send(raw.toString());
      } else {
        console.warn('[WS] ESP not connected — dropped:', msg);
      }
    }
  });

  ws.on('close', () => {
    console.log(`[WS] disconnect ${ip}`);
    if (ws === espSocket) espSocket = null;
  });

  ws.on('error', (err) => console.error('[WS] error', err.message));
});

console.log(`WS bridge listening on :${PORT}`);
