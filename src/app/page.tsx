import Image from "next/image";
import Link from "next/link";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { ProductCard } from "@/components/product/ProductCard";
import { HarvestStatus } from "@/components/product/HarvestStatus";
import { formatKes, getProductById, kilnCup, type ProductId } from "@/content/coffees";
import { redClayAssets } from "@/lib/assets/registry";

const homeHarvest: ProductId[] = ["PLUM SEASON", "HONEY BLOOM", "JASMINE AIR"];

const continuum = [
  { n: "01", label: "Earth", asset: redClayAssets.crops.redEarth, grade: true },
  { n: "02", label: "Coffee", asset: redClayAssets.documentary.kiambuCherryDetail, grade: true },
  { n: "03", label: "Vessel", asset: redClayAssets.objects.kilnRakingLight, grade: false },
  { n: "04", label: "Ritual", asset: redClayAssets.ritual.hands, grade: true },
];

const originsPreview = [
  { name: "Central Kenya", href: "/origins/central-kenya", meta: "Plum Season · Cane Light", asset: redClayAssets.origins.kenyaProcess, className: "home-origin home-origin--kenya" },
  { name: "Kayanza / Burundi", href: "/origins/kayanza-burundi", meta: "Honey Bloom · Red Orchard", asset: redClayAssets.origins.burundiLead, className: "home-origin home-origin--burundi" },
  { name: "Southern Ethiopia", href: "/origins/southern-ethiopia", meta: "Jasmine Air · Blue Hour", asset: redClayAssets.origins.ethiopiaLead, className: "home-origin home-origin--ethiopia" },
];

export default function HomePage() {
  const harvest = homeHarvest.map((id) => getProductById(id)).filter((product) => product !== undefined);
  const material = [redClayAssets.products.materialLaterite, redClayAssets.products.materialBasalt, redClayAssets.products.materialLinen];

  return (
    <main id="main-content" className="home">
      <HeroCarousel />

      <section className="wrap home-continuum" aria-labelledby="continuum-title">
        <div className="home-continuum-head">
          <p className="mono muted">The continuum</p>
          <h2 id="continuum-title" className="serif display-m">Earth becomes coffee. Coffee meets the vessel. The vessel holds a ritual.</h2>
        </div>
        <div className="home-continuum-grid">
          {continuum.map((item, index) => (
            <figure key={item.label} className={`home-continuum-item home-continuum-item--${index + 1}`}>
              <div className="ratio-3-4"><Image className={item.grade ? "grade" : undefined} src={item.asset.src} alt={item.asset.alt} fill sizes="(max-width: 820px) 50vw, 25vw" /></div>
              <figcaption><span className="mono accent">{item.n}</span><span className="serif">{item.label}</span></figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="home-material" aria-labelledby="material-title">
        <Link href="/shop#material-series" className="home-material-stage">
          {material.map((asset, index) => (
            <span key={asset.id} className={`home-material-bag home-material-bag--${index + 1}`}><Image className="cut" src={asset.src} alt={asset.alt} width={444} height={680} sizes="(max-width: 820px) 30vw, 18vw" /></span>
          ))}
        </Link>
        <div className="wrap home-material-caption">
          <div><p className="mono muted">The Material Series</p><h2 id="material-title" className="serif">Laterite, Basalt, Linen — three house coffees.</h2></div>
          <Link className="text-link" href="/shop#material-series">From KES 1,600</Link>
        </div>
      </section>

      <section className="wrap home-harvest" aria-labelledby="harvest-title">
        <div className="section-head">
          <div><p className="mono muted">Current Harvest</p><h2 id="harvest-title" className="serif display-m">Six coffees from three highland regions.</h2></div>
          <Link className="text-link" href="/shop#current-harvest">Shop all coffee</Link>
        </div>
        <HarvestStatus />
        <div className="grid-3">{harvest.map((product) => <ProductCard key={product.id} product={product} />)}</div>
      </section>

      <section className="home-origins" aria-labelledby="origins-title">
        <div className="wrap home-origins-grid">
          <div className="home-origins-intro">
            <p className="mono muted">Origins</p>
            <h2 id="origins-title" className="serif display-m">Three highland regions. Three ways into the coffee.</h2>
            <Link className="text-link" href="/origins">Open The Earthen Folio</Link>
          </div>
          {originsPreview.map((origin) => (
            <Link key={origin.href} href={origin.href} className={origin.className}>
              <span className="home-origin-media"><Image className="grade" src={origin.asset.src} alt={origin.asset.alt} fill sizes="(max-width: 820px) 100vw, 45vw" /></span>
              <span className="home-origin-caption"><span className="serif">{origin.name}</span><span className="mono muted">{origin.meta}</span></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="wrap home-edition" aria-labelledby="edition-title">
        <Link href="/journal/water-and-time" className="home-edition-panel">
          <Image className="grade" src={redClayAssets.documentary.homeProcess.src} alt={redClayAssets.documentary.homeProcess.alt} fill sizes="100vw" />
          <span className="home-edition-scrim" aria-hidden="true" />
          <span className="home-edition-copy">
            <span className="mono">Edition 01 · Featured</span>
            <span>
              <span id="edition-title" className="serif home-edition-title">Water &amp; Time</span>
              <span className="home-edition-dek">On washing, fermentation and the patience a washed coffee asks for, from Central Kenya.</span>
              <span className="text-link">Read the Edition</span>
            </span>
            <span className="mono">Drying rack, Fairview Estate, Kiambu</span>
          </span>
        </Link>
      </section>

      <section className="wrap home-kiln" aria-labelledby="kiln-title">
        <div className="home-kiln-ritual"><Image className="grade" src={redClayAssets.ritual.pourOver.src} alt={redClayAssets.ritual.pourOver.alt} fill sizes="(max-width: 820px) 100vw, 33vw" /></div>
        <div className="home-kiln-copy">
          <p className="mono muted">Object · The Kiln Cup</p>
          <h2 id="kiln-title" className="serif display-m">Clay outside. Glaze within.</h2>
          <p>High-fired iron-rich stoneware with a warm mineral-white interior. A tapered body that holds about 300ml, made for the first cup of the day.</p>
          <div className="button-row"><Link className="button" href="/shop/the-kiln-cup">Shop The Kiln Cup</Link><span>{formatKes(kilnCup.price)}</span></div>
        </div>
        <div className="home-kiln-object"><Image src={redClayAssets.objects.kilnPlinth.src} alt={redClayAssets.objects.kilnPlinth.alt} fill sizes="(max-width: 820px) 100vw, 33vw" /></div>
      </section>
    </main>
  );
}
