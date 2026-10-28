import type { CSSProperties } from "react";
import type { PackageKey } from "@/content/coffees";

type Motif = "arc" | "ridge" | "sun";

type PackageSpec = {
  name: string;
  sub: string;
  notes: string[];
  code: string;
  body: string;
  a: string;
  b?: string;
  ink: string;
  line: string;
  motif: Motif;
  process?: string;
  varieties?: string;
  roast?: string;
  use?: string;
  desc?: string;
};

/** The drawn packaging system: one bag, three motifs. Mirrors the design canvas `Bag` component. */
export const packageSpecs: Record<PackageKey, PackageSpec> = {
  laterite: { name: "Laterite", sub: "House Coffee", notes: ["Red plum", "Brown sugar", "Cacao"], code: "RC / MS / 01", body: "#AE5639", a: "#97462E", ink: "#F6EEE6", line: "rgba(246,238,230,.35)", motif: "arc", use: "Filter / batch / espresso", desc: "A house coffee with a steady profile, composed each season from East African lots." },
  basalt: { name: "Basalt", sub: "House Espresso", notes: ["Dark cherry", "Cacao", "Molasses"], code: "RC / MS / 02", body: "#3B3937", a: "#2A2827", ink: "#ECE7E1", line: "rgba(236,231,225,.3)", motif: "arc", use: "Espresso / moka / milk", desc: "A house espresso with a steady profile, composed each season from East African lots." },
  linen: { name: "Linen", sub: "House Filter", notes: ["Pear", "Bergamot", "Jasmine"], code: "RC / MS / 03", body: "#E6DFD2", a: "#C6B89F", ink: "#2B2723", line: "rgba(43,39,35,.25)", motif: "arc", use: "Pour-over / batch", desc: "A house filter with a steady profile, composed each season from East African lots." },
  "plum-season": { name: "Plum Season", sub: "Kiambu, Kenya", process: "Washed", notes: ["Blackcurrant", "Plum", "Cane sugar"], varieties: "SL28 / SL34 / Ruiru 11", roast: "Light", code: "RC / CH / 01", body: "#5E2D35", a: "#4C232A", b: "#6E3843", ink: "#F4EAE5", line: "rgba(244,234,229,.3)", motif: "ridge" },
  "cane-light": { name: "Cane Light", sub: "Kirinyaga, Kenya", process: "Washed", notes: ["Red currant", "Hibiscus", "Pomelo"], varieties: "SL28 / SL34 / Batian", roast: "Light", code: "RC / CH / 02", body: "#DED2AE", a: "#C9B685", b: "#D3C497", ink: "#2B2723", line: "rgba(43,39,35,.25)", motif: "ridge" },
  "honey-bloom": { name: "Honey Bloom", sub: "Kayanza, Burundi", process: "Washed", notes: ["Red apple", "Honey", "Orange blossom"], varieties: "Red Bourbon", roast: "Light", code: "RC / CH / 03", body: "#C78E4A", a: "#B07A3C", b: "#BC8443", ink: "#22180F", line: "rgba(34,24,15,.3)", motif: "ridge" },
  "red-orchard": { name: "Red Orchard", sub: "Kayanza, Burundi", process: "Natural", notes: ["Raspberry", "Black tea", "Brown sugar"], varieties: "Red Bourbon", roast: "Light", code: "RC / CH / 04", body: "#923C31", a: "#7B3128", b: "#A3493C", ink: "#F6ECE5", line: "rgba(246,236,229,.3)", motif: "ridge" },
  "jasmine-air": { name: "Jasmine Air", sub: "Sidama, Ethiopia", process: "Washed", notes: ["Jasmine", "Yellow peach", "Lemon tea"], varieties: "Ethiopian landrace selections", roast: "Light", code: "RC / CH / 05", body: "#EAE5D7", a: "#D0D2BA", b: "#DDDCC8", ink: "#2B2723", line: "rgba(43,39,35,.25)", motif: "ridge" },
  "blue-hour": { name: "Blue Hour", sub: "Guji, Ethiopia", process: "Natural", notes: ["Strawberry", "Apricot", "Cacao nib"], varieties: "Ethiopian landrace selections", roast: "Light", code: "RC / CH / 06", body: "#2F3947", a: "#252E3A", b: "#3B4858", ink: "#E9E7E2", line: "rgba(233,231,226,.3)", motif: "ridge" },
  afterlight: { name: "Afterlight", sub: "Ethiopia Decaf", process: "Water-process decaf", notes: ["Plum", "Cocoa", "Honey"], roast: "Medium-light", code: "RC / OW / 01", body: "#3E3848", a: "#A35C46", ink: "#EFE8E1", line: "rgba(239,232,225,.3)", motif: "sun", desc: "All of the evening, none of the caffeine." },
};

export function PackageArt({ sku, side = "front", weight = "250 g", label }: Readonly<{ sku: PackageKey; side?: "front" | "back"; weight?: string; label?: string }>) {
  const c = packageSpecs[sku];
  const notes = c.notes.join(" / ");
  const rows = c.motif === "arc"
    ? [{ k: "Series", v: "The Material Series" }, { k: "Brew", v: c.use ?? "" }, { k: "Notes", v: notes }]
    : [{ k: "Origin", v: c.sub }, { k: "Process", v: c.process ?? "" }, ...(c.varieties ? [{ k: "Varieties", v: c.varieties }] : []), { k: "Roast", v: c.roast ?? "" }, { k: "Notes", v: notes }];
  const style = { "--pkg-body": c.body, "--pkg-a": c.a, "--pkg-b": c.b ?? c.a, "--pkg-ink": c.ink, "--pkg-line": c.line } as CSSProperties;

  return (
    <div className="pkg" style={style} role="img" aria-label={label ?? `${c.name} coffee bag, ${side}`}>
      <div className="pkg-contact" aria-hidden="true" />
      <div className="pkg-lift" aria-hidden="true">
        <div className="pkg-body">
          {c.motif === "arc" && <div className="pkg-arc" />}
          {c.motif === "ridge" && <><div className="pkg-ridge-back" /><div className="pkg-ridge-front" /></>}
          {c.motif === "sun" && <div className="pkg-sun" />}
          <div className="pkg-tex" /><div className="pkg-shade" /><div className="pkg-fold" /><div className="pkg-crease-l" /><div className="pkg-crease-r" />
          {side === "front" ? (
            <>
              <div className="pkg-front">
                <div className="pkg-brand">RED CLAY</div>
                <div className="pkg-name">{c.name}</div>
                <div className="pkg-sub">{c.sub}</div>
                <div className="pkg-rule" />
                {c.notes.map((note) => <div className="pkg-note" key={note}>{note}</div>)}
              </div>
              <div className="pkg-foot">
                <span>{c.motif === "ridge" ? `${c.process} · ${weight}` : weight}</span><span className="pkg-div" /><span>Roasted in Nairobi</span><span className="pkg-div" /><span>{c.code}</span>
              </div>
            </>
          ) : (
            <div className="pkg-back">
              <div className="pkg-brand pkg-brand--small">RED CLAY</div>
              <div className="pkg-tagline">Coffee, held by place.</div>
              <div className="pkg-rows">{rows.map((row) => <div className="pkg-row" key={row.k}><span>{row.k}</span><span>{row.v}</span></div>)}</div>
              {c.desc && <div className="pkg-desc">{c.desc}</div>}
              <div className="pkg-back-foot">
                <div className="pkg-stamp">ROASTED ON</div>
                <div className="pkg-barcode"><div /></div>
              </div>
              <div className="pkg-foot pkg-foot--back"><span>{weight} net</span><span>Roasted in Nairobi</span><span>{c.code}</span></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
