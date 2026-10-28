import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/product/ProductCard";
import { HarvestStatus } from "@/components/product/HarvestStatus";
import { currentHarvest, formatKes, kilnCup, materialSeries, otherWaysToDrink } from "@/content/coffees";
import { redClayAssets } from "@/lib/assets/registry";

export const metadata: Metadata = {
  title: "Shop",
  description: "House coffees, six Current Harvest coffees from Kenya, Burundi and Ethiopia, other ways to drink, and The Kiln Cup.",
};

const sections = [
  { id: "material-series", label: "The Material Series" },
  { id: "current-harvest", label: "Current Harvest" },
  { id: "other-ways", label: "Other ways to drink" },
  { id: "objects", label: "Objects" },
];

export default function ShopPage() {
  return (
    <main id="main-content" className="shop">
      <section className="wrap shop-head">
        <h1 className="serif display-l">Shop</h1>
        <nav className="shop-jump" aria-label="Shop sections">
          {sections.map((section) => <a key={section.id} href={`#${section.id}`}>{section.label}</a>)}
        </nav>
      </section>

      <section id="material-series" className="wrap shop-section" aria-labelledby="material-heading">
        <div className="section-rule">
          <h2 id="material-heading" className="mono">The Material Series</h2>
          <p>House coffees with a steady profile, composed each season from East African lots.</p>
        </div>
        <div className="grid-3">{materialSeries.map((product, index) => <ProductCard key={product.id} product={product} priority={index === 0} />)}</div>
      </section>

      <section id="current-harvest" className="wrap shop-section" aria-labelledby="harvest-heading">
        <div className="section-rule">
          <h2 id="harvest-heading" className="mono">Current Harvest</h2>
          <p>Six single-region coffees from Central Kenya, Kayanza and Southern Ethiopia.</p>
        </div>
        <HarvestStatus />
        <div className="grid-3 grid-3--tall">{currentHarvest.map((product) => <ProductCard key={product.id} product={product} />)}</div>
      </section>

      <figure className="shop-interlude">
        <div className="shop-interlude-media"><Image className="grade" src={redClayAssets.origins.kenyaDrying.src} alt={redClayAssets.origins.kenyaDrying.alt} fill sizes="100vw" /></div>
        <figcaption className="wrap"><span className="mono muted">Drying, Kiambu, Kenya</span><span className="serif">Clarity before spectacle.</span></figcaption>
      </figure>

      <section id="other-ways" className="wrap shop-section" aria-labelledby="other-heading">
        <div className="section-rule">
          <h2 id="other-heading" className="mono">Other ways to drink</h2>
          <p>Decaf for the evening, instant for the road, and a box for choosing by place.</p>
        </div>
        <div className="grid-3">{otherWaysToDrink.map((product) => <ProductCard key={product.id} product={product} />)}</div>
      </section>

      <section id="objects" className="wrap shop-section shop-objects" aria-labelledby="objects-heading">
        <div className="section-rule"><h2 id="objects-heading" className="mono">Objects</h2></div>
        <div className="shop-objects-grid">
          <Link href="/shop/the-kiln-cup" className="shop-objects-lead"><Image src={redClayAssets.objects.kilnPlinth.src} alt={redClayAssets.objects.kilnPlinth.alt} fill sizes="(max-width: 820px) 100vw, 58vw" /></Link>
          <div className="shop-objects-second"><Image src={redClayAssets.objects.kilnRakingLight.src} alt={redClayAssets.objects.kilnRakingLight.alt} fill sizes="(max-width: 820px) 50vw, 16vw" /></div>
          <div className="shop-objects-copy">
            <p className="serif display-s">{kilnCup.name}</p>
            <p>Clay outside. Glaze within. Iron-rich stoneware with a mineral-white satin interior, about 300ml to a comfortable fill.</p>
            <div className="button-row"><Link className="button" href="/shop/the-kiln-cup">View The Kiln Cup</Link><span>{formatKes(kilnCup.price)}</span></div>
          </div>
        </div>
      </section>
    </main>
  );
}
