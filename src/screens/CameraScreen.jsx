import { useState } from "react";
import { SectionH } from "../components/ui";

export default function CameraScreen({ state, control }) {
  const { temp, hum, connection, camFrame } = state;
  const [recording] = useState(false);
  const [resolution] = useState("VGA");
  const [framerate] = useState("15");

  return (
    <div className="screen">
      <SectionH
        title="ESP32-CAM · Live Feed"
        right={<span className="label-sm">CAM-01 · 192.168.1.42</span>}
      />

      <div className="panel">
        <div className="panel-body" style={{ padding: 10 }}>
          <div className="cam-frame">
            {camFrame ? (
              <img
                src={camFrame}
                alt="cam"
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            ) : (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "#111",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    letterSpacing: "0.18em",
                    color: "rgba(255,255,255,0.3)",
                  }}
                >
                  NO SIGNAL
                </span>
              </div>
            )}
            <div className="cam-noise" />
            <div className="cam-overlay">
              <span className="corner tl" />
              <span className="corner tr" />
              <span className="corner bl" />
              <span className="corner br" />
              {recording && (
                <span className="rec">
                  <span className="dot" />
                  REC
                </span>
              )}
              <div className="meta-tl">
                CAM-01
                <br />
                {resolution} · {framerate}fps
                <br />
                <span
                  style={{
                    color: connection === "connected" ? "#4ade80" : "#f43f5e",
                  }}
                >
                  {connection === "connected" ? "● LIVE" : "○ OFFLINE"}
                </span>
              </div>
              <div className="meta-br">
                {temp.toFixed(1)}°C
                <br />
                {Math.round(hum)}%RH
                <br />
                {new Date().toLocaleTimeString("en-GB")}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row" style={{ gap: 8 }}>
        <button
          className="btn grow"
          onClick={() => control("light", !state.lampOn)}
          data-variant={state.lampOn ? "primary" : undefined}
        >
          {state.lampOn ? "Lamp · ON" : "Turn on lamp"}
        </button>
      </div>
      <div className="panel grow" style={{ padding: "10px 16px" }}>
        <div className="row" style={{ justifyContent: "space-around" }}>
          <div style={{ textAlign: "center" }}>
            <div className="label-sm" style={{ marginBottom: 2 }}>
              TEMP
            </div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 22,
                fontWeight: 700,
              }}
            >
              {temp.toFixed(1)}
              <span style={{ fontSize: 13, opacity: 0.6 }}>°C</span>
            </div>
          </div>
          <div style={{ width: 1, background: "rgba(255,255,255,0.08)" }} />
          <div style={{ textAlign: "center" }}>
            <div className="label-sm" style={{ marginBottom: 2 }}>
              HUMIDITY
            </div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 22,
                fontWeight: 700,
              }}
            >
              {Math.round(hum)}
              <span style={{ fontSize: 13, opacity: 0.6 }}>%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
