// TorchIcons.tsx
// Welding-torch silhouettes for the process selector. Each is a self-contained
// 24×24 icon: thick round-capped strokes form the tubes/handles, filled shapes
// the bodies, thin strokes the electrode rod / wires / cable. Colour follows
// currentColor and size comes from the parent (.proc .chip svg); pass width /
// className via props to use them elsewhere.

import type { IconProps } from "../types/icon";

export function MigTorch(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      {/* gooseneck tube + nozzle, curving up to the left */}
      <path d="M13 13C11.3 8.6 9 7 5 6.6" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
      <path d="M5.2 6.8L3 5.9" fill="none" stroke="currentColor" strokeWidth="2.9" strokeLinecap="round" />
      {/* pistol-grip body, trigger, and wire leads */}
      <rect x="10.4" y="11.8" width="5.6" height="9.8" rx="2.3" fill="currentColor" />
      <path d="M10.4 15l-2.3 1.4 2.3 1.1z" fill="currentColor" />
      <path d="M12.6 21.4l-.5 2.2M14.4 21.4l.5 2.2" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

export function TigTorch(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      {/* tungsten electrode, thin point to the lower-left */}
      <path d="M10 8.8L3.2 11" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      {/* short back cap to the upper-right */}
      <path d="M12.4 6.4L16.4 4.4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      {/* tapered torch body sweeping down to the right */}
      <path d="M9 6.2C12.8 5.8 16 8 16 12C16 15.8 15.4 18.8 14.6 21C14.3 21.9 13.3 21.8 12.9 20.8C11.6 17.8 8.6 11.6 7.6 8.2C7.2 7 7.9 6.3 9 6.2Z" fill="currentColor" />
    </svg>
  );
}

export function StickTorch(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      {/* holder handle (thick capsule), electrode rod, and curling cable */}
      <path d="M7 20.5L14.5 9" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
      <path d="M14 9L7.5 5.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M15.5 9.5C19 9 20 13 17 14.5C15.6 15.2 14.6 14 15.3 12.8" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}
