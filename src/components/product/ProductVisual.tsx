import Image from "next/image";
import type { Product } from "@/content/coffees";
import { PackageArt } from "@/components/product/PackageArt";
import { ObjectArt } from "@/components/product/ObjectArt";

export type VisualView = "front" | "alternate";

/**
 * Product media on a studio ground. Real photographs are used where they exist
 * (the Material Series packshots and The Kiln Cup); the drawn packaging system
 * covers every other product until final renders replace it.
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

  if (art.type === "bag") {
    return <div className={`pv pv--studio pv--${scale}`}><div className="pv-bag"><PackageArt sku={art.key} side={view === "front" ? "front" : "back"} /></div></div>;
  }

  const kind = art.key === "instant" ? (view === "front" ? "instant" : "sachet") : (view === "front" ? "regions-open" : "regions");
  return <div className={`pv pv--studio pv--${scale}`}><div className={`pv-object pv-object--${kind}`}><ObjectArt kind={kind} /></div></div>;
}
