import { useId, type CSSProperties } from "react";
import { PackageArt } from "@/components/product/PackageArt";

export type ObjectKind = "instant" | "sachet" | "regions" | "regions-open" | "cup-dims";

const ratios: Record<ObjectKind, string> = { instant: "1.15", sachet: "0.9", regions: "1.15", "regions-open": "1.15", "cup-dims": "1.25" };
const labels: Record<ObjectKind, string> = {
  instant: "Red Clay Instant — Ethiopia carton",
  sachet: "Red Clay Instant single sachet",
  regions: "Three Regions discovery box, closed",
  "regions-open": "Three Regions discovery box, open, with three 100 g packs",
  "cup-dims": "The Kiln Cup dimensions: about 82 millimetres across and 94 millimetres high",
};

const abs = (style: CSSProperties): CSSProperties => ({ position: "absolute", ...style });

/** Drawn objects from the packaging system. Mirrors the design canvas `Objects` component. */
export function ObjectArt({ kind }: Readonly<{ kind: ObjectKind }>) {
  return (
    <div className="obj" style={{ aspectRatio: ratios[kind] }} role="img" aria-label={labels[kind]}>
      {kind === "instant" && <InstantCarton />}
      {kind === "sachet" && <Sachet />}
      {kind === "regions" && <RegionsClosed />}
      {kind === "regions-open" && <RegionsOpen />}
      {kind === "cup-dims" && <CupDimensions />}
    </div>
  );
}

function InstantCarton() {
  return <div aria-hidden="true">
    <div className="obj-contact" style={abs({ left: "4cqw", top: "61cqw", width: "84cqw", height: "10cqw" })} />
    <div style={abs({ left: "8cqw", top: "13cqw", width: "56cqw", height: "7cqw", background: "#F1EADD", transform: "skewX(-68deg)", transformOrigin: "bottom left", overflow: "hidden" })}><div className="obj-top" /></div>
    <div style={abs({ left: "64cqw", top: "20cqw", width: "18cqw", height: "46cqw", background: "#CFC4B0", transform: "skewY(-21deg)", transformOrigin: "top left", overflow: "hidden" })}>
      <div className="obj-tex" /><div className="obj-side" />
      <div className="obj-mono" style={abs({ left: "50%", top: "50%", transform: "translate(-50%,-50%) rotate(-90deg)", fontSize: "2.2cqw", whiteSpace: "nowrap", color: "#3F3832" })}>Red Clay Instant</div>
    </div>
    <div style={abs({ left: "8cqw", top: "20cqw", width: "56cqw", height: "46cqw", background: "#EAE2D2", overflow: "hidden" })}>
      <div style={abs({ left: "24cqw", top: "24cqw", width: "44cqw", height: "44cqw", borderRadius: "50%", background: "#C78E4A" })} />
      <div className="obj-tex" /><div className="obj-front" />
      <div style={abs({ left: "5cqw", top: "5cqw", right: "5cqw" })}>
        <div style={{ fontSize: "2.2cqw", letterSpacing: ".38em" }}>RED CLAY</div>
        <div style={{ fontSize: "7cqw", lineHeight: 1, marginTop: "6cqw" }}>Instant</div>
        <div style={{ fontSize: "2.8cqw", letterSpacing: ".05em", marginTop: "1.4cqw" }}>Ethiopia</div>
        <div style={{ width: "4cqw", height: ".2cqw", background: "#1C1917", margin: "3cqw 0" }} />
        <div style={{ fontSize: "2.2cqw", letterSpacing: ".07em" }}>6 sachets</div>
      </div>
      <div className="obj-sans" style={abs({ left: "5cqw", bottom: "3cqw", fontSize: "1.5cqw", letterSpacing: ".06em" })}>Roasted in Nairobi · RC / OW / 02</div>
    </div>
  </div>;
}

const zigzag = "polygon(0 2%,6.25% 0,12.5% 2%,18.75% 0,25% 2%,31.25% 0,37.5% 2%,43.75% 0,50% 2%,56.25% 0,62.5% 2%,68.75% 0,75% 2%,81.25% 0,87.5% 2%,93.75% 0,100% 2%,100% 98%,93.75% 100%,87.5% 98%,81.25% 100%,75% 98%,68.75% 100%,62.5% 98%,56.25% 100%,50% 98%,43.75% 100%,37.5% 98%,31.25% 100%,25% 98%,18.75% 100%,12.5% 98%,6.25% 100%,0 98%)";

function Sachet() {
  return <div aria-hidden="true">
    <div className="obj-contact" style={abs({ left: "24cqw", top: "96cqw", width: "52cqw", height: "8cqw" })} />
    <div style={abs({ left: "28cqw", top: "4cqw", width: "44cqw", height: "96cqw", filter: "drop-shadow(0 2cqw 2.5cqw rgba(28,25,23,.25)) drop-shadow(0 .4cqw .5cqw rgba(28,25,23,.2))" })}>
      <div style={abs({ inset: 0, background: "#EAE2D2", overflow: "hidden", clipPath: zigzag })}>
        <div style={abs({ left: "6cqw", top: "58cqw", width: "56cqw", height: "56cqw", borderRadius: "50%", background: "#C78E4A" })} />
        <div className="obj-crimp" style={{ top: 0 }} /><div className="obj-crimp" style={{ bottom: 0 }} />
        <div className="obj-tex" />
        <div style={abs({ inset: 0, background: "radial-gradient(ellipse 60% 45% at 40% 45%,rgba(255,255,255,.18),rgba(255,255,255,0) 70%),linear-gradient(90deg,rgba(0,0,0,.18),rgba(0,0,0,0) 12%,rgba(0,0,0,0) 86%,rgba(0,0,0,.2))" })} />
        <div style={abs({ left: "5cqw", right: "4cqw", top: "15cqw" })}>
          <div style={{ fontSize: "2.4cqw", letterSpacing: ".36em" }}>RED CLAY</div>
          <div style={{ fontSize: "7cqw", lineHeight: 1, marginTop: "9cqw" }}>Instant</div>
          <div style={{ fontSize: "3cqw", letterSpacing: ".05em", marginTop: "1.6cqw" }}>Ethiopia</div>
          <div style={{ width: "4cqw", height: ".2cqw", background: "#1C1917", margin: "4cqw 0" }} />
          <div className="obj-sans" style={{ fontSize: "1.9cqw", letterSpacing: ".05em", lineHeight: 1.5 }}>One sachet,<br />one cup of hot water.</div>
        </div>
      </div>
    </div>
  </div>;
}

function RegionsBoxFront({ top, height }: Readonly<{ top: string; height: string }>) {
  return <div style={abs({ left: "6cqw", top, width: "70cqw", height, background: "#33302D", color: "#ECE7E1", overflow: "hidden" })}>
    <div style={abs({ right: "6cqw", top: 0, bottom: 0, width: "15cqw", display: "flex" })}>
      <div style={{ flex: 1, background: "#5E2D35" }} /><div style={{ flex: 1, background: "#C78E4A" }} /><div style={{ flex: 1, background: "#EAE5D7" }} />
    </div>
    <div className="obj-tex" /><div className="obj-front" />
  </div>;
}

function RegionsClosed() {
  return <div aria-hidden="true">
    <div className="obj-contact" style={abs({ left: "2cqw", top: "63cqw", width: "92cqw", height: "10cqw" })} />
    <div style={abs({ left: "6cqw", top: "24cqw", width: "70cqw", height: "6cqw", background: "#4A4643", transform: "skewX(-67deg)", transformOrigin: "bottom left", overflow: "hidden" })}><div className="obj-top" /></div>
    <div style={abs({ left: "76cqw", top: "30cqw", width: "14cqw", height: "38cqw", background: "#2E2B29", transform: "skewY(-23deg)", transformOrigin: "top left", overflow: "hidden" })}><div className="obj-side" /></div>
    <RegionsBoxFront top="30cqw" height="38cqw" />
    <div style={abs({ left: "11cqw", top: "34cqw", color: "#ECE7E1" })}>
      <div style={{ fontSize: "2cqw", letterSpacing: ".38em" }}>RED CLAY</div>
      <div style={{ fontSize: "6cqw", lineHeight: 1, marginTop: "3.6cqw" }}>Three Regions</div>
      <div style={{ fontSize: "2.4cqw", letterSpacing: ".05em", marginTop: "1.2cqw" }}>Discovery Box</div>
      <div style={{ width: "4cqw", height: ".2cqw", background: "currentColor", opacity: 0.7, margin: "2.2cqw 0" }} />
      <div style={{ fontSize: "1.8cqw", letterSpacing: ".07em", lineHeight: 1.5 }}>Plum Season · Honey Bloom · Jasmine Air</div>
    </div>
    <div className="obj-sans" style={abs({ left: "11cqw", top: "63cqw", color: "#ECE7E1", fontSize: "1.5cqw", letterSpacing: ".06em" })}>3 × 100 g · Roasted in Nairobi · RC / OW / 03</div>
  </div>;
}

function RegionsOpen() {
  return <div aria-hidden="true">
    <div className="obj-contact" style={abs({ left: "2cqw", top: "69cqw", width: "92cqw", height: "10cqw" })} />
    <div style={abs({ left: "12cqw", top: "3cqw", width: "64cqw", height: "44cqw", background: "#EAE2D2", transform: "rotate(-3deg)", boxShadow: "0 2cqw 4cqw -2cqw rgba(28,25,23,.4)", overflow: "hidden" })}>
      <div className="obj-tex" /><div className="obj-front" />
      <div style={abs({ left: "6cqw", top: "6cqw", right: "6cqw" })}>
        <div className="obj-mono" style={{ fontSize: "1.6cqw", color: "#5C5B57" }}>Three Regions</div>
        <div style={{ fontSize: "3.6cqw", lineHeight: 1.2, marginTop: "2.4cqw", fontStyle: "italic" }}>Taste the collection by place before choosing a full bag.</div>
      </div>
    </div>
    <div style={abs({ left: "6cqw", top: "46cqw", width: "70cqw", height: "12cqw", background: "#1A1817" })} />
    <div style={abs({ left: "12cqw", top: "32cqw", width: "18cqw" })}><PackageArt sku="plum-season" weight="100 g" /></div>
    <div style={abs({ left: "32cqw", top: "30cqw", width: "18cqw" })}><PackageArt sku="honey-bloom" weight="100 g" /></div>
    <div style={abs({ left: "52cqw", top: "32cqw", width: "18cqw" })}><PackageArt sku="jasmine-air" weight="100 g" /></div>
    <div style={abs({ left: "76cqw", top: "46cqw", width: "12cqw", height: "28cqw", background: "#2E2B29", transform: "skewY(-23deg)", transformOrigin: "top left", overflow: "hidden" })}><div className="obj-side" /></div>
    <div style={abs({ left: "6cqw", top: "52cqw", width: "70cqw", height: "22cqw", background: "#33302D", overflow: "hidden" })}>
      <div className="obj-tex" /><div className="obj-front" />
      <div style={abs({ left: 0, right: 0, top: 0, height: ".5cqw", background: "rgba(255,255,255,.12)" })} />
      <div style={abs({ left: "5cqw", top: "4cqw", color: "#ECE7E1", fontSize: "2.2cqw", letterSpacing: ".38em" })}>RED CLAY</div>
    </div>
  </div>;
}

function CupDimensions() {
  const id = useId();
  return <>
    <div aria-hidden="true" style={abs({ left: "2cqw", top: "4cqw", width: "62cqw", height: "62cqw" })}>
      <svg viewBox="0 0 400 400" style={{ width: "100%", height: "100%" }}>
        <defs>
          <linearGradient id={`${id}-body`} x1="0" x2="1" y1="0" y2="0"><stop offset="0" stopColor="#4E1D10" /><stop offset=".24" stopColor="#A4513A" /><stop offset=".36" stopColor="#BE6A4A" /><stop offset=".72" stopColor="#8A3F27" /><stop offset="1" stopColor="#47190D" /></linearGradient>
          <linearGradient id={`${id}-inner`} x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#B9AE9C" /><stop offset="1" stopColor="#F6F2EA" /></linearGradient>
        </defs>
        <ellipse cx="200" cy="316" rx="100" ry="10" fill="#1C1917" opacity=".12" />
        <path d="M116 120 C116 200 119 268 127 294 Q133 313 200 315 Q267 313 273 294 C281 268 284 200 284 120 A84 20 0 0 1 116 120 Z" fill={`url(#${id}-body)`} />
        <ellipse cx="200" cy="120" rx="84" ry="20" fill="#EFE9DE" />
        <ellipse cx="200" cy="121.5" rx="77" ry="16" fill={`url(#${id}-inner)`} />
        <g stroke="#5C5B57" strokeWidth="1.2"><line x1="116" y1="62" x2="284" y2="62" /><line x1="116" y1="54" x2="116" y2="70" /><line x1="284" y1="54" x2="284" y2="70" /><line x1="372" y1="100" x2="372" y2="315" /><line x1="364" y1="100" x2="380" y2="100" /><line x1="364" y1="315" x2="380" y2="315" /></g>
        <text x="200" y="48" textAnchor="middle" fontFamily="var(--font-mono), monospace" fontSize="12" letterSpacing="1" fill="#5C5B57">≈ 82 MM</text>
        <text x="386" y="212" fontFamily="var(--font-mono), monospace" fontSize="12" letterSpacing="1" fill="#5C5B57" transform="rotate(90 386 212)" textAnchor="middle">≈ 94 MM</text>
      </svg>
    </div>
    <div style={abs({ left: "70cqw", right: "3cqw", top: "16cqw", display: "flex", flexDirection: "column", gap: "2.2cqw" })}>
      <div className="obj-mono" style={{ fontSize: "1.7cqw", color: "#5C5B57" }}>The Kiln Cup</div>
      <div style={{ fontSize: "3.4cqw", lineHeight: 1.15 }}>Clay outside. Glaze within.</div>
      <div className="obj-sans" style={{ fontSize: "1.8cqw", lineHeight: 1.7, color: "#3D3C39" }}>≈ 300 ml comfortable fill<br />≈ 340 ml to brim<br />≈ 360 g<br />Iron-rich stoneware<br />Dishwasher and microwave safe</div>
    </div>
  </>;
}
