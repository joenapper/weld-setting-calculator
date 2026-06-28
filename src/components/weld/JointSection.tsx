// JointSection.tsx
// Live weld cross-section. Driven entirely by props; runs a requestAnimationFrame
// tween so plate thicknesses ease toward their target sizes. The SVG <g> is
// written imperatively (innerHTML from the pure string builders) to avoid React
// reconciling 60fps of generated nodes.

import { useEffect, useRef } from "react";
import {
  BUILDERS,
  CX,
  OVERHEAD_BUILDERS,
  toPx,
  VERTICAL_BUILDERS,
} from "../../lib/jointGeometry";
import type { Joint, Position, Units } from "../../types/weld";

const CY = 170; // viewBox centre-Y (480 × 340); the drawing rotates about (CX, CY)

// how the cross-section is oriented for each welding position
const POSITION_ANGLE: Record<Position, number> = {
  flat: 0,
  horizontal: 0,
  vertical: 90, // plates stood on end
  overhead: 180, // plates upside down
};

interface JointSectionProps {
  joint: Joint;
  units: Units;
  position: Position;
  a: number; // member A thickness, mm
  b: number; // member B thickness, mm
}

export default function JointSection({
  joint,
  units,
  position,
  a,
  b,
}: JointSectionProps) {
  const gRef = useRef<SVGGElement>(null);
  const propsRef = useRef({ joint, units, position, a, b });
  // the currently-drawn pixel thicknesses, eased toward the target each frame
  const drawn = useRef<{ a: number | null; b: number | null }>({
    a: null,
    b: null,
  });

  // keep the loop reading the latest props without restarting the rAF
  propsRef.current = { joint, units, position, a, b };

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion:reduce)").matches;
    let raf: number;
    const tick = () => {
      const p = propsRef.current;
      const targetA = toPx(p.a);
      const targetB = toPx(p.b);
      const prevA = drawn.current.a;
      const prevB = drawn.current.b;
      let nextA: number;
      let nextB: number;
      // first frame (prev === null) or reduced motion: snap straight to target
      if (prevA === null || prevB === null || reduce) {
        nextA = targetA;
        nextB = targetB;
      } else {
        // ease 22% of the remaining distance per frame, snapping when close
        nextA = prevA + (targetA - prevA) * 0.22;
        nextB = prevB + (targetB - prevB) * 0.22;
        if (Math.abs(targetA - nextA) < 0.2) nextA = targetA;
        if (Math.abs(targetB - nextB) < 0.2) nextB = targetB;
      }
      drawn.current = { a: nextA, b: nextB };
      if (gRef.current) {
        // bespoke per-position builder if one exists (drawn upright, no transform);
        // otherwise fall back to the flat builder rotated to the position's angle.
        const bespoke =
          p.position === "vertical"
            ? VERTICAL_BUILDERS[p.joint]
            : p.position === "overhead"
              ? OVERHEAD_BUILDERS[p.joint]
              : undefined;
        let html: string;
        let transform = "";
        if (bespoke) {
          html = bespoke(nextA, nextB, p.a, p.b, p.units);
        } else {
          html = BUILDERS[p.joint](nextA, nextB, p.a, p.b, p.units);
          const angle = POSITION_ANGLE[p.position];
          if (angle !== 0) {
            // keep each dimension label upright by counter-rotating it about its anchor
            html = html.replace(
              /<text class="dim" x="(-?[\d.]+)" y="(-?[\d.]+)"/g,
              `<text class="dim" transform="rotate(${-angle} $1 $2)" x="$1" y="$2"`,
            );
            transform = `rotate(${angle} ${CX} ${CY})`;
          }
        }
        gRef.current.setAttribute("transform", transform);
        gRef.current.innerHTML = html;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="stage">
      <svg
        className="draw"
        viewBox="0 0 480 340"
        role="img"
        aria-label="Weld joint cross-section"
      >
        <defs>
          <linearGradient id="steel" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--steel-top)" />
            <stop offset="1" stopColor="var(--steel-bot)" />
          </linearGradient>
          <pattern
            id="hatch"
            width="9"
            height="9"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="9"
              stroke="rgba(255,255,255,.06)"
              strokeWidth="1"
            />
          </pattern>
          <linearGradient id="weld" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--weld-1)" />
            <stop offset="0.5" stopColor="var(--weld-2)" />
            <stop offset="1" stopColor="var(--weld-3)" />
          </linearGradient>
          <filter id="glow" x="-70%" y="-70%" width="240%" height="240%">
            <feGaussianBlur stdDeviation="4.5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <g ref={gRef} />
      </svg>
    </div>
  );
}
