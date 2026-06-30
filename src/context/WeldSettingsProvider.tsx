// WeldSettingsProvider.tsx
// Provides the single weld-settings state instance (from useWeldSettings) to the
// tree, so the screen's components can read it via useWeldSettingsContext. Kept
// in its own file so it exports only a component.

import type { ReactNode } from "react";
import { useWeldSettings } from "@/hooks/useWeldSettings";
import { WeldSettingsContext } from "./WeldSettingsContext";

export function WeldSettingsProvider({ children }: { children: ReactNode }) {
  // called once here — the single source of truth shared with every consumer
  const settings = useWeldSettings();
  return (
    <WeldSettingsContext.Provider value={settings}>
      {children}
    </WeldSettingsContext.Provider>
  );
}
