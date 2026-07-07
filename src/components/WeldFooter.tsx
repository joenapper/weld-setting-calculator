// WeldFooter.tsx
// App footer: a process-aware "starting points, not a WPS" disclaimer — the
// wording differs per process (MIG / TIG / Stick) in consumables and technique cues.

import { useWeldSettingsContext } from "@/context/WeldSettingsContext";
import type { Process } from "@/types/weld";

function disclaimer(process: Process) {
  switch (process) {
    case "tig":
      return (
        <>
          TIG (GTAW) starting points, modelled on common practice — <b>not a substitute for a WPS</b>. Every
          machine, tungsten, gas and joint runs a little differently: set these, run a test bead on scrap of the
          same thickness <b>in the position you'll weld</b>, then fine-tune by puddle control and travel speed.
          Mismatched thicknesses are calculated on the thinner (governing) member, which burns through first.
        </>
      );
    case "stick":
      return (
        <>
          Stick (SMAW) starting points, modelled on common electrode charts — <b>not a substitute for a WPS</b>.
          Every machine, electrode and polarity runs a little differently: set these, strike a test bead on scrap
          of the same thickness <b>in the position you'll weld</b>, then fine-tune by arc length and the sound of
          the arc, chipping the slag to read the bead. Mismatched thicknesses are calculated on the thinner
          (governing) member, which burns through first.
        </>
      );
    default:
      return (
        <>
          Solid-wire (GMAW) starting points for short-circuit / spray transfer, modelled on common manufacturer
          chart values — <b>not a substitute for a WPS</b>. Every machine, wire and gas combination runs a little
          differently: set these, weld a test bead on scrap of the same thickness <b>in the position you'll weld</b>,
          then fine-tune by arc sound and bead shape. Mismatched thicknesses are calculated on the thinner
          (governing) member, which burns through first.
        </>
      );
  }
}

export default function WeldFooter() {
  const { process } = useWeldSettingsContext();
  return <footer className="note">{disclaimer(process)}</footer>;
}
