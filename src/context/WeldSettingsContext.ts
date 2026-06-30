// WeldSettingsContext.ts
// The context object + consumer hook for the shared weld settings. The provider
// lives in WeldSettingsProvider.tsx, kept separate so this module exports no
// React component (keeps Fast Refresh clean).

import { createContext, useContext } from "react";
import type { WeldSettings } from "@/hooks/useWeldSettings";

export const WeldSettingsContext = createContext<WeldSettings | null>(null);

export function useWeldSettingsContext(): WeldSettings {
  const settings = useContext(WeldSettingsContext);
  if (!settings) {
    throw new Error(
      "useWeldSettingsContext must be used within a WeldSettingsProvider",
    );
  }
  return settings;
}
