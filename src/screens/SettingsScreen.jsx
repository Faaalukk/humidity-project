import { Panel, SectionH, NumField } from "../components/ui";

export default function SettingsScreen({ state, set, sendWS }) {
  const {
    tempTarget,
    humTarget,
    tempThreshLo,
    tempThreshHi,
    humThreshLo,
    humThreshHi,
  } = state;

  function setTemp(v) {
    set({ tempTarget: v });
    sendWS({ type: "setting", temp_set: v, humi_set: humTarget });
  }
  function setHumi(v) {
    set({ humTarget: v });
    sendWS({ type: "setting", temp_set: tempTarget, humi_set: v });
  }

  return (
    <div className="screen">
      <SectionH
        title="Setpoints"
        right={<span className="label-sm">UNIT 01</span>}
      />

      <Panel title="Temperature" id="TGT-T">
        <div
          className="panel-body"
          style={{ display: "flex", flexDirection: "column", gap: 12 }}
        >
          <div className="row between">
            <span className="label">Target</span>
            <NumField
              value={tempTarget}
              onChange={setTemp}
              step={0.1}
              min={20}
              max={45}
              suffix="°C"
            />
          </div>
          <div className="row" style={{ gap: 10 }}>
            <div className="col grow" style={{ gap: 6 }}>
              <span className="label">Low alert</span>
              <NumField
                value={tempThreshLo}
                onChange={(v) => set({ tempThreshLo: v })}
                step={0.1}
                min={15}
                max={45}
                suffix="°C"
              />
            </div>
            <div className="col grow" style={{ gap: 6 }}>
              <span className="label">High alert</span>
              <NumField
                value={tempThreshHi}
                onChange={(v) => set({ tempThreshHi: v })}
                step={0.1}
                min={15}
                max={50}
                suffix="°C"
              />
            </div>
          </div>
        </div>
      </Panel>

      <Panel title="Humidity" id="TGT-H">
        <div
          className="panel-body"
          style={{ display: "flex", flexDirection: "column", gap: 12 }}
        >
          <div className="row between">
            <span className="label">Target</span>
            <NumField
              value={humTarget}
              onChange={setHumi}
              step={1}
              min={20}
              max={95}
              suffix="%"
            />
          </div>
          <div className="row" style={{ gap: 10 }}>
            <div className="col grow" style={{ gap: 6 }}>
              <span className="label">Low alert</span>
              <NumField
                value={humThreshLo}
                onChange={(v) => set({ humThreshLo: v })}
                step={1}
                min={10}
                max={95}
                suffix="%"
              />
            </div>
            <div className="col grow" style={{ gap: 6 }}>
              <span className="label">High alert</span>
              <NumField
                value={humThreshHi}
                onChange={(v) => set({ humThreshHi: v })}
                step={1}
                min={10}
                max={100}
                suffix="%"
              />
            </div>
          </div>
        </div>
      </Panel>
    </div>
  );
}
