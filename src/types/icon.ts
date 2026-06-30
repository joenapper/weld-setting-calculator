// icon.ts
// Shared props for every SVG icon component — the standard SVG element
// attributes, so callers can pass className, width, style, etc. Size/colour for
// the in-app usages is handled by CSS; props are for reuse elsewhere.

import type { SVGProps } from "react";

export type IconProps = SVGProps<SVGSVGElement>;
