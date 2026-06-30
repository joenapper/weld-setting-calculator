// JointIcons.tsx
// Joint-type icons. Stroked paths wrapped by IconBase so the parent context
// (.seg button .ic) controls stroke weight; props forward to the <svg>.

import { IconBase } from "./IconBase";
import type { IconProps } from "@/types/icon";

export function FilletJoint(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 19h16" />
      <path d="M11 19V5" />
      <path d="M11 19l4-4" />
    </IconBase>
  );
}

export function ButtJoint(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M3 12h7" />
      <path d="M14 12h7" />
      <path d="M12 8v8" />
    </IconBase>
  );
}

export function LapJoint(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M3 14h12" />
      <path d="M9 10h12" />
    </IconBase>
  );
}

export function CornerJoint(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M6 4v16h14" />
    </IconBase>
  );
}
