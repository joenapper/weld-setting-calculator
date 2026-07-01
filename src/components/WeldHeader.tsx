// WeldHeader.tsx
// App header: the title, the process selector and the theme toggle. The selected
// process comes from the shared settings context; MIG and TIG are wired up,
// Stick is disabled until its engine exists.

import type { ReactNode } from "react";
import { MigTorch, StickTorch, TigTorch } from "@/icons/TorchIcons";
import { useWeldSettingsContext } from "@/context/WeldSettingsContext";
import type { Process } from "@/types/weld";
import ThemeToggle from "./ThemeToggle";

const PROCESSES: { val: Process; name: string; icon: ReactNode; soon: boolean }[] = [
  { val: "mig", name: "MIG", icon: <MigTorch />, soon: false },
  { val: "tig", name: "TIG", icon: <TigTorch />, soon: false },
  { val: "stick", name: "Stick", icon: <StickTorch />, soon: true },
];

export default function WeldHeader() {
  const { process, setProcess } = useWeldSettingsContext();
  return (
    <header className="head">
      <h1>Weld Setting Calculator</h1>
      <div className="head-right">
        <div className="proc" role="group" aria-label="Welding process">
          {PROCESSES.map((p) => (
            <button
              key={p.val}
              type="button"
              className={`chip${p.soon ? " soon" : ""}${process === p.val ? " on" : ""}`}
              aria-pressed={process === p.val}
              disabled={p.soon}
              onClick={() => setProcess(p.val)}
            >
              {p.icon}
              {p.name}
            </button>
          ))}
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
