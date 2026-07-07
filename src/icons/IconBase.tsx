// IconBase.tsx
// Shared wrapper for the stroked icons (joints, positions): a 24×24 <svg> whose
// paths sit in a `.ic` group, letting the parent context (.seg button .ic)
// control stroke weight. Props forward to the <svg>.

import type { IconProps } from "@/types/icon";

export function IconBase({ children, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <g className="ic">{children}</g>
    </svg>
  );
}
