// ThemeToggle.tsx
// A single icon button that flips between dark and light themes. Shows the icon
// of the mode it will switch to, with an action-describing aria-label.

import { useTheme } from "@/hooks/useTheme";
import { MoonIcon, SunIcon } from "@/icons/ThemeIcons";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={!isDark}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
