// useTheme.ts
// Theme state for the app. Dark is the default; we fall back to the OS
// preference only when the user hasn't made an explicit choice, and persist
// any explicit choice to localStorage.

import { useEffect, useState } from "react";

export type Theme = "dark" | "light";

const STORAGE_KEY = "weld-theme";

function getInitialTheme(): Theme {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === "dark" || saved === "light") return saved;
  if (window.matchMedia("(prefers-color-scheme: light)").matches) return "light";
  return "dark";
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return { theme, toggle };
}
