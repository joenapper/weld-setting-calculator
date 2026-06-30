// PositionIcons.tsx
// Welding-position icons — an arrow sketches the direction the torch points.
// Stroked paths wrapped by IconBase so the parent context (.seg button .ic)
// controls stroke weight; props forward to the <svg>.

import { IconBase } from "./IconBase";
import type { IconProps } from "@/types/icon";

export function FlatPosition(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 15h16" />
      <path d="M12 4v6" />
      <path d="M9 7l3 3 3-3" />
    </IconBase>
  );
}

export function HorizontalPosition(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M6 4v16" />
      <path d="M6 12h9" />
      <path d="M12 9l3 3-3 3" />
    </IconBase>
  );
}

export function VerticalPosition(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M6 20h12" />
      <path d="M12 20V8" />
      <path d="M9 11l3-3 3 3" />
    </IconBase>
  );
}

export function OverheadPosition(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 5h16" />
      <path d="M12 14V8" />
      <path d="M9 11l3-3 3 3" />
    </IconBase>
  );
}
