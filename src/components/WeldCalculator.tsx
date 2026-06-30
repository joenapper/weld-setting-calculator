// WeldCalculator.tsx
// The weld setting calculator screen: provides the shared settings and composes
// the header, input panel, live cross-section and results. State/behaviour lives
// in useWeldSettings (via WeldSettingsProvider); each child reads what it needs
// from context.

import { WeldSettingsProvider } from "@/context/WeldSettingsProvider";
import WeldHeader from "./WeldHeader";
import WeldInputs from "./WeldInputs";
import JointSection from "./JointSection";
import ResultsCard from "./ResultsCard";
import WeldFooter from "./WeldFooter";
import "./weld-calculator.css";

export default function WeldCalculator() {
  return (
    <WeldSettingsProvider>
      <div className="weld-tool">
        <div className="tool">
          <WeldHeader />

          <main className="layout">
            <WeldInputs />

            <div className="preview">
              <JointSection />
              <ResultsCard />
            </div>
          </main>

          <WeldFooter />
        </div>
      </div>
    </WeldSettingsProvider>
  );
}
