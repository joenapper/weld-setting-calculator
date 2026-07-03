// ResultsCard.tsx
// The recommended-settings output. Reads the engine result from context and
// renders the fields for the active process — MIG shows voltage + wire-feed,
// TIG shows tungsten + AC/DC polarity. `result.process` discriminates the union.

import { fmtThickness } from "@/lib/weldConfig";
import { useWeldSettingsContext } from "@/context/WeldSettingsContext";

export default function ResultsCard() {
  const { result, units } = useWeldSettingsContext();
  // when the config isn't recommended the engine returns "—" for the numbers
  return (
    <div className="out" role="region" aria-label="Recommended starting settings">
      <div className="lead">
        <div className="num amps">
          <div className="k">Amperage</div>
          <div className="v">
            {result.amps} {result.recommended && <small>A</small>}
          </div>
        </div>

        {result.process === "mig" ? (
          <>
            <div className="num">
              <div className="k">Voltage</div>
              <div className="v">
                {result.volts} {result.recommended && <small>V</small>}
              </div>
            </div>
            <div className="num">
              <div className="k">Wire feed ≈</div>
              <div className="v">
                {result.wfs} {result.recommended && <small>IPM</small>}
              </div>
            </div>
          </>
        ) : (
          <div className="num">
            <div className="k">Tungsten</div>
            <div className="v">
              {result.tungsten} {result.recommended && <small>mm</small>}
            </div>
          </div>
        )}
      </div>

      <div className="chips">
        <div className="pill">
          <b>Gas</b>
          {result.gas}
        </div>
        <div className="pill">
          <b>Polarity</b>
          {result.process === "mig" ? "DCEP · electrode +" : result.polarity}
        </div>
        {result.process === "mig" && (
          <div className="pill">
            <b>Transfer</b>
            {result.transfer}
          </div>
        )}
        <div className="pill">
          <b>Governing t</b>
          {fmtThickness(result.gov, units)}
        </div>
      </div>

      <div className="flags">
        {result.flags.map((flag) => (
          <div className={`flag ${flag.severity}`} key={`${flag.severity}:${flag.text}`}>
            <span className="i" />
            <span>{flag.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
