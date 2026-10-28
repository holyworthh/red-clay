import Image from "next/image";
import type { PackageKey, Product } from "@/content/coffees";
import { packageSpecs } from "@/components/product/PackageArt";
import { ObjectArt } from "@/components/product/ObjectArt";

export type VisualView = "front" | "alternate";

/**
 * Product media on a studio ground. Bags use the real Material Series packshots
 * and photographic renders built from them (public/media/red-clay/products/bag-*);
 * The Kiln Cup uses its photographs; the boxed objects use the drawn ObjectArt.
 */
export function ProductVisual({ product, view = "front", sizes = "(max-width: 760px) 50vw, 30vw", priority = false, scale = "card" }: Readonly<{ product: Product; view?: VisualView; sizes?: string; priority?: boolean; scale?: "card" | "stage" | "thumb" }>) {
  const { art, media } = product;

  if (art.type === "object" && art.key === "kiln") {
    const photo = view === "front" ? media.photo : media.alternatePhoto;
    if (!photo?.src) return null;
    return <div className="pv pv--bleed"><Image src={photo.src} alt={photo.alt} fill sizes={sizes} priority={priority} /></div>;
  }

  if (view === "front" && media.photo?.src) {
    return <div className={`pv pv--field pv--${scale}`}><div className="pv-cut"><Image src={media.photo.src} alt={media.photo.alt} width={444} height={680} sizes={sizes} priority={priority} /></div></div>;
  }

  if (art.type === "bag") return <BagPhoto sku={art.key} side={view === "front" ? "front" : "back"} scale={scale} sizes={sizes} priority={priority} />;

  const kind = art.key === "instant" ? (view === "front" ? "instant" : "sachet") : (view === "front" ? "regions-open" : "regions");
  return <div className={`pv pv--studio pv--${scale}`}><div className={`pv-object pv-object--${kind}`}><ObjectArt kind={kind} /></div></div>;
}

/** A photographic bag render on the packshot field. `small` is the 100 g pack (Three Regions). */
export function BagPhoto({ sku, side = "front", small = false, scale = "card", sizes = "(max-width: 760px) 50vw, 30vw", priority = false, className = "" }: Readonly<{ sku: PackageKey; side?: "front" | "back"; small?: boolean; scale?: "card" | "stage" | "thumb"; sizes?: string; priority?: boolean; className?: string }>) {
  const name = packageSpecs[sku].name;
  const src = `/media/red-clay/products/bag-${sku}${small ? "-100g" : ""}-${side}.jpg`;
  const alt = `${name} coffee bag${small ? ", 100 g" : ""}, ${side}.`;
  return <div className={`pv pv--field pv--${scale} ${className}`}><div className={`pv-cut ${small ? "pv-cut--small" : ""}`}><Image src={src} alt={alt} width={896} height={1360} sizes={sizes} priority={priority} /></div></div>;
}
