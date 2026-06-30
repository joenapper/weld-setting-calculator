// WeldHeader.tsx
// App header: the title, the (display-only) process selector, and the theme toggle.

import { MigTorch, StickTorch, TigTorch } from "@/icons/TorchIcons";
import ThemeToggle from "./ThemeToggle";

// Process selector (display-only for now — only MIG is wired up).
const processes = [
  { name: "MIG", state: "on", icon: <MigTorch /> },
  { name: "TIG", state: "soon", icon: <TigTorch /> },
  { name: "Stick", state: "soon", icon: <StickTorch /> },
];

export default function WeldHeader() {  
  return (
    <header className="head">
      <h1>Weld Setting Calculator</h1>
      <div className="head-right">
        <div className="proc">
          {processes.map((process) => (
            <span key={process.name} className={`chip ${process.state}`}>
              {process.icon}
              {process.name}
            </span>
          ))}
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
