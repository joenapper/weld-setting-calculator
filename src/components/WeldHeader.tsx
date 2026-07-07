// WeldHeader.tsx
// App header: the title, the process selector and the theme toggle. The selected
// process comes from the shared settings context; MIG, TIG and Stick are all
// wired up.

import type { ReactNode } from "react";
import { MigTorch, StickTorch, TigTorch } from "@/icons/TorchIcons";
import { useWeldSettingsContext } from "@/context/WeldSettingsContext";
import type { Process } from "@/types/weld";
import ThemeToggle from "./ThemeToggle";

const PROCESSES: { val: Process; name: string; icon: ReactNode }[] = [
  { val: "mig", name: "MIG", icon: <MigTorch /> },
  { val: "tig", name: "TIG", icon: <TigTorch /> },
  { val: "stick", name: "Stick", icon: <StickTorch /> },
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
              className={`chip${process === p.val ? " on" : ""}`}
              aria-pressed={process === p.val}
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
