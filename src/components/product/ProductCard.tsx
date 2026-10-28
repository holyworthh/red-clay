import Link from "next/link";
import { priceLabel, productMeta, type Product } from "@/content/coffees";
import { ProductVisual } from "@/components/product/ProductVisual";

export function ProductCard({ product, priority = false, compact = false }: Readonly<{ product: Product; priority?: boolean; compact?: boolean }>) {
  const notes = product.notes.length ? product.notes.join(" / ") : product.shortDescription;
  return (
    <Link className={`product-card ${compact ? "product-card--compact" : ""}`} href={`/shop/${product.slug}`}>
      <div className="product-card-media">
        <ProductVisual product={product} priority={priority} />
        <div className="product-card-alt" aria-hidden="true"><ProductVisual product={product} view="alternate" /></div>
      </div>
      <div className="product-card-copy">
        <div>
          <p className="product-card-name">{product.name}</p>
          <p className="mono product-card-meta">{productMeta(product)}</p>
          {!compact && <p className="product-card-notes">{notes}</p>}
        </div>
        <p className="product-card-price">{priceLabel(product)}</p>
      </div>
    </Link>
  );
}
