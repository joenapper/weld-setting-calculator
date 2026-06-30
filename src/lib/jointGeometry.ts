// jointGeometry.ts
// Pure functions that build the weld cross-section as SVG markup strings.
// No global state — every builder takes (aPx, bPx, realA, realB, units) so it
// can be unit-tested and reused anywhere.
//
// Two parallel sets of sizes flow through here:
//   • *Px values  — the animated, clamped ON-SCREEN pixel thicknesses used to
//                   actually draw the plates.
//   • real* values — the true mm thicknesses, used only for the dimension LABELS.
//
// Coordinate space is the SVG viewBox "0 0 480 340"; CX is the vertical centre
// line that joints are built around. Y increases downward (SVG convention).

import type { Joint, Units } from "../types/weld";

export const PX_PER_MM = 5; // on-screen pixels per mm of plate thickness
export const MIN_PX = 7; // floor so a very thin plate is still visible
export const MAX_PX = 120; // ceiling so a thick plate can't overflow the stage
export const CX = 240; // x of the centre line (half of the 480-wide viewBox)

// Convert a real mm thickness to a clamped on-screen pixel thickness.
export const toPx = (mm: number): number =>
  Math.max(MIN_PX, Math.min(MAX_PX, mm * PX_PER_MM));

// Round to 1 decimal place — keeps the generated SVG path strings compact.
const r1 = (n: number): number => Math.round(n * 10) / 10;

// Format a real mm thickness for an on-drawing dimension label, in the active units.
const dimLabel = (mm: number, units: Units): string => {
  if (units === "mm") {
    const v = r1(mm);
    return (Number.isInteger(v) ? v : v.toFixed(1)) + " mm";
  }
  return (mm / 25.4).toFixed(3) + " in";
};

// A rectangular steel plate at (x, y) of width/height (w, h): gradient fill +
// hatch overlay + edge stroke, with a subtle highlight line along the top edge.
function plate(x: number, y: number, w: number, h: number): string {
  x = r1(x);
  y = r1(y);
  w = r1(w);
  h = r1(h);
  return `<g>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#steel)"/>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#hatch)"/>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="var(--steel-edge)" stroke-width="1.5"/>
    <line x1="${x}" y1="${y}" x2="${x + w}" y2="${y}" stroke="rgba(255,255,255,.16)" stroke-width="1.2"/>
  </g>`;
}

// Same styling as plate(), but for an arbitrary polygon (used for the bevelled
// edges of a V-groove butt joint).
//   points          — polygon corners as [x, y] pairs
//   hiX1, hiX2, hiY — start/end x and the y of the top highlight line
function platePoly(
  points: number[][],
  hiX1: number,
  hiX2: number,
  hiY: number,
): string {
  const d =
    "M" + points.map((p) => `${r1(p[0])} ${r1(p[1])}`).join(" L") + " Z";
  return `<g>
    <path d="${d}" fill="url(#steel)"/>
    <path d="${d}" fill="url(#hatch)"/>
    <path d="${d}" fill="none" stroke="var(--steel-edge)" stroke-width="1.5"/>
    <line x1="${r1(hiX1)}" y1="${r1(hiY)}" x2="${r1(hiX2)}" y2="${r1(hiY)}" stroke="rgba(255,255,255,.16)" stroke-width="1.2"/>
  </g>`;
}

// A fillet weld bead: a right triangle anchored at the joint corner
// (cornerX, cornerY) with a convex (bulging) face.
//   side — +1 draws the bead to the right of the corner, -1 to the left
//   legH — horizontal weld leg length (px)
//   legV — vertical weld leg length (px)
function fillet(
  cornerX: number,
  cornerY: number,
  side: number,
  legH: number,
  legV: number,
  vDir = -1, // -1 = bead rises above the corner (default), +1 = hangs below (overhead)
): string {
  // top = end of the vertical leg, corner = the joint root, end = end of horizontal leg
  const topX = cornerX,
    topY = cornerY + vDir * legV,
    endX = cornerX + side * legH,
    endY = cornerY;
  // quadratic control point pushed outward from the leg midpoint to bulge the face
  const midX = (topX + endX) / 2,
    midY = (topY + endY) / 2,
    bulge = Math.min(legH, legV) * 0.5,
    ctrlX = midX + side * bulge,
    ctrlY = midY + vDir * bulge;
  return `<path d="M${r1(topX)} ${r1(topY)} L${r1(cornerX)} ${r1(cornerY)} L${r1(endX)} ${r1(endY)} Q${r1(ctrlX)} ${r1(ctrlY)} ${r1(topX)} ${r1(topY)} Z" fill="url(#weld)" filter="url(#glow)"/>`;
}

// A vertical weld bead for the on-end weld-face views. Square ends — the weld's
// convex cap faces away in this view, so we wouldn't see a rounded end.
function weldColumn(x: number, y: number, w: number, h: number): string {
  return `<rect x="${r1(x)}" y="${r1(y)}" width="${r1(w)}" height="${r1(h)}" fill="url(#weld)" filter="url(#glow)"/>`;
}

// A dimension annotation: extension lines, a ticked leader line, and a label.
//   orient   — "v" measures a vertical span, "h" a horizontal span
//   leaderAt — the coordinate the leader line sits at (x for "v", y for "h")
//   start    — where the measured span begins (y for "v", x for "h")
//   length   — the measured span
//   plateEdge — coordinate of the plate edge the extension lines spring from
//   labelSide — -1 places the label on the near side of the leader, +1 the far side
function dim(
  orient: "v" | "h",
  leaderAt: number,
  start: number,
  length: number,
  plateEdge: number,
  labelSide: number,
  label: string,
): string {
  leaderAt = r1(leaderAt);
  start = r1(start);
  length = r1(length);
  const tick = 4; // tick half-length
  let s = "";
  if (orient === "v") {
    const yStart = start,
      yEnd = start + length;
    // extension lines from the plate edge out to the leader
    s += `<line class="ext" x1="${plateEdge}" y1="${yStart}" x2="${leaderAt}" y2="${yStart}"/>`;
    s += `<line class="ext" x1="${plateEdge}" y1="${yEnd}" x2="${leaderAt}" y2="${yEnd}"/>`;
    // the leader line spanning the measured length, capped with ticks
    s += `<line class="leader" x1="${leaderAt}" y1="${yStart}" x2="${leaderAt}" y2="${yEnd}"/>`;
    s += `<line class="tick" x1="${leaderAt - tick}" y1="${yStart}" x2="${leaderAt + tick}" y2="${yStart}"/>`;
    s += `<line class="tick" x1="${leaderAt - tick}" y1="${yEnd}" x2="${leaderAt + tick}" y2="${yEnd}"/>`;
    // centred on the span (dominant-baseline) and offset to the outward side, so
    // it stays centred and clear of the plate under any rotation
    const textX = leaderAt + labelSide * 10,
      anchor = labelSide < 0 ? "end" : "start";
    s += `<text class="dim" x="${r1(textX)}" y="${r1((yStart + yEnd) / 2)}" text-anchor="${anchor}" dominant-baseline="central">${label}</text>`;
  } else {
    const xStart = start,
      xEnd = start + length;
    s += `<line class="ext" x1="${xStart}" y1="${plateEdge}" x2="${xStart}" y2="${leaderAt}"/>`;
    s += `<line class="ext" x1="${xEnd}" y1="${plateEdge}" x2="${xEnd}" y2="${leaderAt}"/>`;
    s += `<line class="leader" x1="${xStart}" y1="${leaderAt}" x2="${xEnd}" y2="${leaderAt}"/>`;
    s += `<line class="tick" x1="${xStart}" y1="${leaderAt - tick}" x2="${xStart}" y2="${leaderAt + tick}"/>`;
    s += `<line class="tick" x1="${xEnd}" y1="${leaderAt - tick}" x2="${xEnd}" y2="${leaderAt + tick}"/>`;
    const textY = leaderAt + labelSide * 16;
    s += `<text class="dim" x="${r1((xStart + xEnd) / 2)}" y="${r1(textY)}" text-anchor="middle" dominant-baseline="central">${label}</text>`;
  }
  return s;
}

// Weld leg size scaled to the thinner plate, clamped to a sensible px range.
const weldLeg = (aPx: number, bPx: number): number =>
  Math.max(9, Math.min(55, Math.min(aPx, bPx) * 0.85));

// ---------- FILLET (T-joint: upright member on a base plate, welded both sides) ----------
function buildFillet(
  aPx: number,
  bPx: number,
  realA: number,
  realB: number,
  units: Units,
): string {
  // base = horizontal plate (thickness bPx); upright = vertical member (thickness aPx)
  const baseW = 240,
    baseX = CX - baseW / 2,
    uprightH = 150,
    // centre the upright + base vertically in the 340-tall view
    baseTop = 245 - bPx / 2,
    uprightTop = baseTop - uprightH,
    uprightX = CX - aPx / 2;
  // clamp each weld leg to the room available either side of the upright
  const leg = weldLeg(aPx, bPx),
    availLeft = uprightX - baseX,
    availRight = baseX + baseW - (uprightX + aPx);
  let s = plate(baseX, baseTop, baseW, bPx) + plate(uprightX, uprightTop, aPx, uprightH);
  s +=
    fillet(uprightX, baseTop, -1, Math.min(leg, availLeft), leg) +
    fillet(uprightX + aPx, baseTop, 1, Math.min(leg, availRight), leg);
  s +=
    dim("h", uprightTop - 18, uprightX, aPx, uprightTop, -1, dimLabel(realA, units)) +
    dim("v", baseX + baseW + 18, baseTop, bPx, baseX + baseW, 1, dimLabel(realB, units));
  return s;
}

// ---------- BUTT (two plates edge-to-edge, top-aligned) ----------
// Thin (< 3 mm): square edges with a simple bead. Thicker: a V-groove with a
// crowned cap on top and a root bead underneath.
function buildButt(
  aPx: number,
  bPx: number,
  realA: number,
  realB: number,
  units: Units,
): string {
  // plates kept compact (±112) so the 90°/180° rotated views leave room for the
  // thickness labels at the ends without overflowing the box
  const plateW = 105,
    topY = 170 - Math.max(aPx, bPx) / 2,
    grooveDepth = Math.min(aPx, bPx);
  const crownH = 8, // how far the cap bulges above the surface
    crownOver = 5, // how far the cap overlaps onto each plate
    rootBeadH = 5, // how far the root bead bulges below
    leftOut = CX - 112,
    rightOut = CX + 112;
  let s = "";
  if (Math.min(realA, realB) < 3) {
    // square-edge butt: two plates with a small gap, one bead bridging them
    const gapHalf = 5,
      leftX = CX - gapHalf - plateW,
      rightX = CX + gapHalf;
    s += plate(leftX, topY, plateW, aPx) + plate(rightX, topY, plateW, bPx);
    const capHalf = gapHalf + crownOver,
      rootY = topY + grooveDepth;
    s += `<path d="M${r1(CX - capHalf)} ${r1(topY)} Q${CX} ${r1(topY - crownH)} ${r1(CX + capHalf)} ${r1(topY)} L${r1(CX + gapHalf)} ${r1(rootY)} Q${CX} ${r1(rootY + rootBeadH)} ${r1(CX - gapHalf)} ${r1(rootY)} Z" fill="url(#weld)" filter="url(#glow)"/>`;
    s +=
      dim("v", leftX - 18, topY, aPx, leftX, -1, dimLabel(realA, units)) +
      dim("v", rightX + plateW + 18, topY, bPx, rightX + plateW, 1, dimLabel(realB, units));
  } else {
    // V-groove butt: each plate is bevelled toward the root, wide at the top
    const rootHalf = 4, // half the root opening at the bottom
      topHalf = Math.min(rootHalf + grooveDepth * 0.45, 34), // half the groove width at the top
      rootY = topY + grooveDepth;
    s += platePoly(
      [
        [leftOut, topY],
        [CX - topHalf, topY],
        [CX - rootHalf, rootY],
        [CX - rootHalf, topY + aPx],
        [leftOut, topY + aPx],
      ],
      leftOut,
      CX - topHalf,
      topY,
    );
    s += platePoly(
      [
        [rightOut, topY],
        [CX + topHalf, topY],
        [CX + rootHalf, rootY],
        [CX + rootHalf, topY + bPx],
        [rightOut, topY + bPx],
      ],
      CX + topHalf,
      rightOut,
      topY,
    );
    s += `<path d="M${r1(CX - topHalf - crownOver)} ${r1(topY)} Q${CX} ${r1(topY - crownH)} ${r1(CX + topHalf + crownOver)} ${r1(topY)} L${r1(CX + rootHalf)} ${r1(rootY)} Q${CX} ${r1(rootY + rootBeadH)} ${r1(CX - rootHalf)} ${r1(rootY)} Z" fill="url(#weld)" filter="url(#glow)"/>`;
    s +=
      dim("v", leftOut - 18, topY, aPx, leftOut, -1, dimLabel(realA, units)) +
      dim("v", rightOut + 18, topY, bPx, rightOut, 1, dimLabel(realB, units));
  }
  return s;
}

// ---------- LAP (top plate overlaps the bottom, fillet at the seated edge) ----------
function buildLap(
  aPx: number,
  bPx: number,
  realA: number,
  realB: number,
  units: Units,
): string {
  // bottom plate (thickness bPx) spans full width; top plate (thickness aPx)
  // sits on it and is welded at its right-hand edge (topRight)
  const bottomW = 210,
    bottomX = CX - bottomW / 2,
    bottomTop = 170 + (aPx - bPx) / 2, // centre the stacked plates vertically
    topX = bottomX,
    topW = 160,
    topY = bottomTop - aPx,
    topRight = topX + topW;
  const leg = weldLeg(aPx, bPx),
    availRight = bottomX + bottomW - topRight;
  let s = plate(bottomX, bottomTop, bottomW, bPx) + plate(topX, topY, topW, aPx);
  s += fillet(topRight, bottomTop, 1, Math.min(leg, availRight), Math.min(leg, aPx));
  s +=
    dim("v", topX - 18, topY, aPx, topX, -1, dimLabel(realA, units)) +
    dim("v", bottomX + bottomW + 18, bottomTop, bPx, bottomX + bottomW, 1, dimLabel(realB, units));
  return s;
}

// ---------- CORNER (L-shape: flush on the outside, fillet on the inside) ----------
function buildCorner(
  aPx: number,
  bPx: number,
  realA: number,
  realB: number,
  units: Units,
): string {
  // base = bottom leg (thickness bPx); upright = vertical leg (thickness aPx) on its left
  const baseW = 200,
    baseX = CX - baseW / 2,
    uprightH = 150,
    // centre the L-shape: base on CX, upright + base centred vertically
    baseTop = 245 - bPx / 2,
    uprightTop = baseTop - uprightH,
    uprightX = baseX;
  const leg = weldLeg(aPx, bPx),
    availRight = baseX + baseW - (uprightX + aPx);
  let s = plate(baseX, baseTop, baseW, bPx) + plate(uprightX, uprightTop, aPx, uprightH);
  s += fillet(uprightX + aPx, baseTop, 1, Math.min(leg, availRight), leg);
  s +=
    dim("h", uprightTop - 18, uprightX, aPx, uprightTop, -1, dimLabel(realA, units)) +
    dim("v", baseX + baseW + 18, baseTop, bPx, baseX + baseW, 1, dimLabel(realB, units));
  return s;
}

// ---------- FILLET, VERTICAL position: weld-face view, plates stood on end ----------
// A vertical rotation of the flat T-joint: the upright (A) is seen edge-on in the
// centre with the base plate (B) face-on either side, weld bead each side. The
// upright is edge-on so its WIDTH scales with thickness (a real dimension). The base
// is face-on (thickness into the page) so it's a fixed face with a numeric callout.
function buildFilletVertical(
  aPx: number,
  _bPx: number,
  realA: number,
  realB: number,
  units: Units,
): string {
  const yTop = 74,
    yBot = 286,
    h = yBot - yTop;
  const face = 120,
    upright = aPx,
    weldW = Math.max(10, Math.min(aPx * 0.6, 36));
  let x = CX - (2 * face + 2 * weldW + upright) / 2;
  const faceLeftX = x;
  x += face;
  const weld1X = x;
  x += weldW;
  const uprightX = x;
  x += upright;
  const weld2X = x;
  x += weldW;
  const faceRightX = x;
  let s =
    plate(faceLeftX, yTop, face, h) +
    plate(faceRightX, yTop, face, h) +
    plate(uprightX, yTop, upright, h);
  s += weldColumn(weld1X, yTop, weldW, h) + weldColumn(weld2X, yTop, weldW, h);
  // upright (A): real dimension across its (live) width, below the drawing
  s += dim("h", yBot + 18, uprightX, upright, yBot, 1, dimLabel(realA, units));
  // base (B): numeric callout only (fixed shape), above a base face
  const callout = (cx: number, label: string) =>
    `<line class="ext" x1="${r1(cx)}" y1="${yTop}" x2="${r1(cx)}" y2="${yTop - 14}"/>` +
    `<text class="dim" x="${r1(cx)}" y="${yTop - 18}" text-anchor="middle">${label}</text>`;
  s += callout(faceLeftX + face / 2, dimLabel(realB, units));
  return s;
}

// ---------- FILLET, OVERHEAD position: the flat T-joint flipped upside down ----------
// Base plate (B) along the top, upright member (A) hanging down, welds at the top corners.
function buildFilletOverhead(
  aPx: number,
  bPx: number,
  realA: number,
  realB: number,
  units: Units,
): string {
  const baseW = 240,
    baseX = CX - baseW / 2,
    uprightH = 150,
    // centre the base + hanging upright vertically
    baseBot = 95 + bPx / 2,
    baseTopY = baseBot - bPx,
    uprightX = CX - aPx / 2;
  const leg = weldLeg(aPx, bPx),
    availL = uprightX - baseX,
    availR = baseX + baseW - (uprightX + aPx);
  let s = plate(baseX, baseTopY, baseW, bPx) + plate(uprightX, baseBot, aPx, uprightH);
  // welds in the top corners, beads hanging downward (vDir = +1)
  s +=
    fillet(uprightX, baseBot, -1, Math.min(leg, availL), leg, 1) +
    fillet(uprightX + aPx, baseBot, 1, Math.min(leg, availR), leg, 1);
  // thickness labels: A below the hanging upright, B to the right of the base
  s +=
    dim("h", baseBot + uprightH + 18, uprightX, aPx, baseBot + uprightH, 1, dimLabel(realA, units)) +
    dim("v", baseX + baseW + 18, baseTopY, bPx, baseX + baseW, 1, dimLabel(realB, units));
  return s;
}

// A joint cross-section builder: takes pixel thicknesses (drawn) + real mm
// thicknesses (labelled) and returns SVG markup.
type Builder = (
  aPx: number,
  bPx: number,
  realA: number,
  realB: number,
  units: Units,
) => string;

// Joint type → flat/horizontal cross-section builder.
export const BUILDERS: Record<Joint, Builder> = {
  fillet: buildFillet,
  butt: buildButt,
  lap: buildLap,
  corner: buildCorner,
};

// Position-specific overrides. A joint without an entry falls back to BUILDERS
// rotated by JointSection. Currently only the fillet has bespoke orientations.
export const VERTICAL_BUILDERS: Partial<Record<Joint, Builder>> = {
  fillet: buildFilletVertical,
};
export const OVERHEAD_BUILDERS: Partial<Record<Joint, Builder>> = {
  fillet: buildFilletOverhead,
};
