// JointSection.tsx
// Live weld cross-section. Driven by the shared settings context; runs a
// requestAnimationFrame tween so plate thicknesses ease toward their target
// sizes. The SVG <g> is written imperatively (innerHTML from the pure string
// builders) to avoid React reconciling 60fps of generated nodes.

import { useEffect, useRef } from "react";
import {
  BUILDERS,
  CX,
  OVERHEAD_BUILDERS,
  toPx,
  VERTICAL_BUILDERS,
} from "@/lib/jointGeometry";
import { useWeldSettingsContext } from "@/context/WeldSettingsContext";
import type { Position } from "@/types/weld";

const CY = 170; // viewBox centre-Y (480 × 340); the drawing rotates about (CX, CY)

// how the cross-section is oriented for each welding position
const POSITION_ANGLE: Record<Position, number> = {
  flat: 0,
  horizontal: 0,
  vertical: 90, // plates stood on end
  overhead: 180, // plates upside down
};

export default function JointSection() {
  const { joint, units, position, material, a, b } = useWeldSettingsContext();
  const gRef = useRef<SVGGElement>(null);
  const propsRef = useRef({ joint, units, position, a, b });
  // the currently-drawn pixel thicknesses, eased toward the target each frame
  const drawn = useRef<{ a: number | null; b: number | null }>({
    a: null,
    b: null,
  });
  // signature of the last SVG written, so redundant writes are skipped at idle
  const writtenRef = useRef("");

  // keep the loop reading the latest props without restarting the rAF
  propsRef.current = { joint, units, position, a, b };
  // likewise keep a live handle on the geometry builders, so hot-reloading
  // jointGeometry.ts takes effect without the rAF holding a stale copy
  const buildersRef = useRef({ BUILDERS, VERTICAL_BUILDERS, OVERHEAD_BUILDERS });
  buildersRef.current = { BUILDERS, VERTICAL_BUILDERS, OVERHEAD_BUILDERS };

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion:reduce)");
    let raf: number;
    const tick = () => {
      const p = propsRef.current;
      const targetA = toPx(p.a);
      const targetB = toPx(p.b);
      const prevA = drawn.current.a;
      const prevB = drawn.current.b;
      let nextA: number;
      let nextB: number;
      // first frame (prev === null) or reduced motion: snap straight to target.
      // motion.matches is read each frame so a mid-session preference change
      // takes effect without remounting.
      if (prevA === null || prevB === null || motion.matches) {
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

      // Everything the SVG string depends on (material is a CSS var on the wrapper,
      // not part of the markup). Once the tween has settled and no input has moved
      // this stops changing, so we skip the rebuild + innerHTML write — the loop
      // stays alive to catch the next change but does no work at idle.
      const sig = `${nextA}|${nextB}|${p.a}|${p.b}|${p.joint}|${p.position}|${p.units}`;
      if (sig !== writtenRef.current && gRef.current) {
        writtenRef.current = sig;
        // bespoke per-position builder if one exists (drawn upright, no transform);
        // otherwise fall back to the flat builder rotated to the position's angle.
        const builders = buildersRef.current;
        const bespoke =
          p.position === "vertical"
            ? builders.VERTICAL_BUILDERS[p.joint]
            : p.position === "overhead"
              ? builders.OVERHEAD_BUILDERS[p.joint]
              : undefined;
        let html: string;
        let transform = "";
        if (bespoke) {
          html = bespoke(nextA, nextB, p.a, p.b, p.units);
        } else {
          html = builders.BUILDERS[p.joint](nextA, nextB, p.a, p.b, p.units);
          const angle = POSITION_ANGLE[p.position];
          if (angle !== 0) {
            // Keep each dimension label upright by counter-rotating it, and flip
            // its anchor to whichever side now faces away from centre so the text
            // extends outward (never back into the plate).
            html = html.replace(
              /<text class="dim" x="(-?[\d.]+)" y="(-?[\d.]+)" text-anchor="(start|middle|end)" dominant-baseline="central">/g,
              (_m, xs: string, ys: string, anchor: string) => {
                const x = parseFloat(xs);
                const y = parseFloat(ys);
                // where the label's anchor lands after the group rotation
                const fx = angle === 90 ? CX - (y - CY) : 2 * CX - x; // 90° vs 180°
                // 90° turns a side label into a top/bottom one (and vice versa);
                // 180° keeps orientation but flips the outward side
                const side = fx < CX ? "end" : "start";
                const finalAnchor =
                  angle === 180
                    ? anchor === "middle"
                      ? "middle"
                      : side
                    : anchor === "middle"
                      ? side
                      : "middle";
                return `<text class="dim" transform="rotate(${-angle} ${xs} ${ys})" x="${xs}" y="${ys}" text-anchor="${finalAnchor}" dominant-baseline="central">`;
              },
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
    <div className="stage" data-material={material}>
      <svg
        className="draw"
        viewBox="0 0 480 340"
        role="img"
        aria-label="Weld joint cross-section"
      >
        <defs>
          <linearGradient id="steel" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--plate-top)" />
            <stop offset="1" stopColor="var(--plate-bot)" />
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
