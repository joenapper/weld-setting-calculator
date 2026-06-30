// WeldFooter.tsx
// App footer: footer note

export default function WeldFooter() {  
  return (
    <footer className="note">
      Solid-wire (GMAW) starting points for short-circuit / spray transfer, modelled on common manufacturer
      chart values — <b>not a substitute for a WPS</b>. Every machine, wire and gas combination runs a little
      differently: set these, weld a test bead on scrap of the same thickness <b>in the position you'll weld</b>,
      then fine-tune by arc sound and bead shape. Mismatched thicknesses are calculated on the thinner
      (governing) member, which burns through first.
    </footer>
  );
}
