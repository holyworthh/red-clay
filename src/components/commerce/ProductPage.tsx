import Image from "next/image";
import Link from "next/link";
import { BuyBox } from "@/components/commerce/BuyBox";
import { ProductGallery, type GalleryView } from "@/components/commerce/ProductGallery";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductVisual } from "@/components/product/ProductVisual";
import { PackageArt } from "@/components/product/PackageArt";
import { ObjectArt } from "@/components/product/ObjectArt";
import { formatKes, getProductById, kilnCup, type Product } from "@/content/coffees";
import { editions } from "@/content/editions";
import { redClayAssets, type RedClayAsset } from "@/lib/assets/registry";

const sectionName: Record<Product["family"], string> = {
  "material-series": "The Material Series",
  "current-harvest": "Current Harvest",
  "other-ways-to-drink": "Other ways to drink",
  object: "Objects",
};

function Photo({ asset, sizes, grade = true }: Readonly<{ asset: RedClayAsset; sizes: string; grade?: boolean }>) {
  if (!asset.src) return null;
  return <Image className={grade ? "grade" : undefined} src={asset.src} alt={asset.alt} fill sizes={sizes} />;
}

function galleryFor(product: Product): GalleryView[] {
  const main = (node: React.ReactNode) => <div className="gallery-stage">{node}</div>;
  const { art, media } = product;
  if (art.type === "object" && art.key === "kiln") {
    return [
      { label: "Plinth", main: main(<ProductVisual product={product} sizes="(max-width: 1180px) 100vw, 46vw" priority />), thumb: <ProductVisual product={product} sizes="10vw" /> },
      { label: "Raking light", main: main(<ProductVisual product={product} view="alternate" sizes="(max-width: 1180px) 100vw, 46vw" />), thumb: <ProductVisual product={product} view="alternate" sizes="10vw" /> },
      { label: "Dimensions", main: main(<div className="pv pv--paper"><div className="pv-object pv-object--dims"><ObjectArt kind="cup-dims" /></div></div>), thumb: <div className="pv pv--paper"><div className="pv-object pv-object--dims"><ObjectArt kind="cup-dims" /></div></div> },
    ];
  }
  if (art.type === "object") {
    const views: GalleryView[] = [
      { label: art.key === "instant" ? "Carton" : "Open", main: main(<ProductVisual product={product} scale="stage" priority />), thumb: <ProductVisual product={product} scale="thumb" /> },
      { label: art.key === "instant" ? "Sachet" : "Closed", main: main(<ProductVisual product={product} view="alternate" scale="stage" />), thumb: <ProductVisual product={product} view="alternate" scale="thumb" /> },
    ];
    if (art.key === "regions") views.push({ label: "100 g pack", main: main(<div className="pv pv--studio"><div className="pv-bag pv-bag--small"><PackageArt sku="honey-bloom" weight="100 g" /></div></div>), thumb: <div className="pv pv--studio"><div className="pv-bag pv-bag--small"><PackageArt sku="honey-bloom" weight="100 g" /></div></div> });
    return views;
  }
  const views: GalleryView[] = [
    { label: "Front", main: main(<ProductVisual product={product} scale="stage" priority sizes="(max-width: 1180px) 60vw, 26vw" />), thumb: <ProductVisual product={product} scale="thumb" sizes="8vw" /> },
    { label: "Back", main: main(<div className="pv pv--studio pv--stage"><div className="pv-bag"><PackageArt sku={art.key} side="back" /></div></div>), thumb: <div className="pv pv--studio pv--thumb"><div className="pv-bag"><PackageArt sku={art.key} side="back" /></div></div> },
  ];
  if (product.family === "current-harvest") {
    views.push(
      { label: "With The Kiln Cup", main: main(<div className="pv-pair"><div className="pv pv--studio"><div className="pv-bag"><PackageArt sku={art.key} /></div></div><div className="pv-pair-photo"><Photo asset={redClayAssets.objects.kilnRakingLight} grade={false} sizes="(max-width: 1180px) 50vw, 23vw" /></div></div>), thumb: <div className="pv pv--bleed"><Photo asset={redClayAssets.objects.kilnRakingLight} grade={false} sizes="8vw" /></div> },
      { label: "Detail", main: main(<div className="pv pv--studio pv--detail"><div className="pv-bag"><PackageArt sku={art.key} /></div></div>), thumb: <div className="pv pv--studio pv--detail"><div className="pv-bag"><PackageArt sku={art.key} /></div></div> },
    );
  } else if (media.alternatePhoto?.src && product.family === "material-series") {
    views.push({ label: "Material", main: main(<div className="pv pv--bleed"><Photo asset={media.alternatePhoto} grade={false} sizes="(max-width: 1180px) 100vw, 46vw" /></div>), thumb: <div className="pv pv--bleed"><Photo asset={media.alternatePhoto} grade={false} sizes="8vw" /></div> });
  }
  return views;
}

function recordFor(product: Product) {
  if (product.kind === "kiln-cup") {
    return { title: "Object record", rows: [
      ["Body", "High-fired iron-rich stoneware"], ["Exterior", "Exposed red stoneware"], ["Interior", "Mineral-white satin glaze"],
      ["Form", "Gently tapered, handleless"], ["Capacity", "≈ 300 ml fill · 340 ml brim"], ["Size", "≈ 82 mm rim · 94 mm high"], ["Weight", "≈ 360 g"],
    ] };
  }
  if (product.family === "material-series") {
    return { title: "House record", rows: [["Series", "The Material Series"], ["Profile", product.notes.join(" / ")], ["Made for", product.uses.join(", ")], ["Composition", "East African, seasonal"], ["Formats", "250 g · 1 kg"]] };
  }
  if (product.id === "THREE REGIONS") {
    return { title: "Box record", rows: [["Contents", "3 × 100 g"], ["Kenya", "Plum Season"], ["Burundi", "Honey Bloom"], ["Ethiopia", "Jasmine Air"], ["Process", "All washed"], ["Roast", "Light"]] };
  }
  if (product.id === "RED CLAY INSTANT — ETHIOPIA") {
    return { title: "Product record", rows: [["Origin", "Ethiopia"], ["Format", "6 single sachets"], ["Make", "One sachet, hot water"]] };
  }
  const rows: string[][] = [["Origin", product.region === "Ethiopia Decaf" ? "Ethiopia" : product.region]];
  if (product.process) rows.push(["Process", product.process]);
  if (product.varieties) rows.push(["Varieties", product.varieties]);
  if (product.roast) rows.push(["Roast", product.roast]);
  rows.push(["Notes", product.notes.join(" / ")], ["Size", "250 g"]);
  return { title: "Origin record", rows };
}

export function ProductPage({ product }: Readonly<{ product: Product }>) {
  const record = recordFor(product);
  const related = product.relatedProducts.map((id) => getProductById(id)).filter((item) => item !== undefined);
  const edition = product.relatedEdition ? editions.find((item) => item.slug === product.relatedEdition) : undefined;
  const subline = product.family === "current-harvest" ? `${product.region}\n${product.process} · 250 g` : product.kind === "kiln-cup" ? "Iron-rich stoneware\n≈ 300 ml comfortable fill" : `${product.role}${product.family === "material-series" ? `\n${product.uses.join(" · ")}` : ""}`;
  const recordImage = product.media.secondaryProcess ?? product.media.origin;

  return (
    <main id="main-content" className={`pdp pdp--${product.family}`}>
      <div className="wrap pdp-top">
        <nav className="mono muted crumbs" aria-label="Breadcrumb"><Link href="/shop">Shop</Link> / <Link href={`/shop#${product.family === "material-series" ? "material-series" : product.family === "current-harvest" ? "current-harvest" : product.family === "object" ? "objects" : "other-ways"}`}>{sectionName[product.family]}</Link></nav>
        <div className="pdp-grid">
          <div className="pdp-a">
            <p className="mono muted pdp-code"><span>{product.lotCode}{product.family === "current-harvest" ? ` — ${product.region.split(",")[0]}` : ""}</span><span>{sectionName[product.family]}</span></p>
            <div>
              <h1 className="serif pdp-title">{product.name}</h1>
              <p className="pdp-sub">{subline}</p>
            </div>
            <p className="pdp-lede">{product.shortDescription}</p>
            <BuyBox product={product} />
          </div>
          <div className="pdp-b"><ProductGallery views={galleryFor(product)} name={product.name} /></div>
          <div className="pdp-c">
            <p className="mono muted">{record.title}</p>
            <dl className="record">{record.rows.map(([key, value]) => <div key={key}><dt>{key}</dt><dd>{value}</dd></div>)}</dl>
            {recordImage?.src && product.family === "current-harvest" && (
              <figure className="pdp-record-figure">
                <div className="ratio-4-3"><Photo asset={recordImage} sizes="22vw" /></div>
                <figcaption className="mono muted">{recordImage.location ?? recordImage.alt.replace(/\.$/, "")}</figcaption>
              </figure>
            )}
          </div>
        </div>
      </div>

      <section className="pdp-statement">
        <p className="mono muted">{product.kind === "kiln-cup" ? "The object" : product.family === "other-ways-to-drink" ? "The idea" : "In the cup"}</p>
        <p className="serif display-m">{product.sensoryStatement}</p>
      </section>

      {product.family === "current-harvest" && <HarvestStory product={product} />}
      {product.family === "material-series" && <MaterialStory product={product} />}
      {product.kind === "kiln-cup" && <KilnStory />}
      {product.id === "THREE REGIONS" && <RegionsStory />}
      {(product.id === "AFTERLIGHT" || product.id === "RED CLAY INSTANT — ETHIOPIA") && <RitualBand product={product} />}

      {edition && (
        <section className="wrap pdp-edition">
          <Link href={`/journal/${edition.slug}`} className="pdp-edition-link">
            <span className="pdp-edition-copy">
              <span className="mono muted">Edition {edition.storyOrdinal}</span>
              <span className="serif display-m">{edition.title}</span>
              <span>{edition.relatedBlurb}</span>
              <span className="text-link">Read the Edition</span>
            </span>
            <span className="ratio-16-10"><Photo asset={edition.leadAsset} sizes="(max-width: 820px) 100vw, 50vw" /></span>
          </Link>
        </section>
      )}

      <section className="wrap pdp-related" aria-labelledby="related-heading">
        <div className="section-rule"><h2 id="related-heading" className="mono">{product.family === "current-harvest" ? "More from the Current Harvest" : "You may also like"}</h2><Link href="/shop">Shop all</Link></div>
        <div className="grid-3">{related.map((item) => <ProductCard key={item.id} product={item} compact />)}</div>
      </section>
    </main>
  );
}

function HarvestStory({ product }: Readonly<{ product: Product }>) {
  const { origin, process, botanical } = product.media;
  const cherry = product.media.alternatePhoto;
  const washed = product.process === "Washed";
  const regionName = product.region.split(",")[0];
  // Only call a photograph "Place" when it was taken in this coffee's own region.
  const placeLabel = origin && (origin.location ?? origin.alt).includes(regionName) ? "Place" : "Context";
  return (
    <>
      {origin?.src && (
        <figure className="wrap pdp-place">
          <div className="pdp-place-media"><Photo asset={origin} sizes="100vw" /></div>
          <figcaption className="mono muted">{placeLabel} — {origin.location ?? origin.alt.replace(/\.$/, "")}</figcaption>
        </figure>
      )}
      <section className="wrap pdp-process">
        {process?.src && <figure className="pdp-process-main"><div className="ratio-3-2"><Photo asset={process} sizes="(max-width: 820px) 100vw, 58vw" /></div><figcaption className="mono muted">Process — {process.alt.replace(/\.$/, "")}</figcaption></figure>}
        <div className="pdp-process-copy">
          <p className="mono muted">{product.process}</p>
          <h2 className="serif display-s">{washed ? "The fruit comes off before the coffee dries." : "The seed dries inside the whole fruit."}</h2>
          <p>{washed ? "Washing removes the fruit before drying, which tends to leave a cleaner, more transparent cup." : "Natural processing dries the seed inside the cherry before hulling. It changes the drying conditions; it does not dictate one flavour."} {product.varieties ? `${product.varieties} make up this lot.` : ""}</p>
          <p>{product.comparison}</p>
        </div>
        {cherry?.src && <figure className="pdp-process-detail"><div className="ratio-4-5"><Photo asset={cherry} sizes="(max-width: 820px) 100vw, 30vw" /></div><figcaption className="mono muted">{cherry.alt.replace(/\.$/, "")}</figcaption></figure>}
        {botanical?.src && botanical !== cherry && <figure className="pdp-process-botanical"><div className="ratio-1-1"><Photo asset={botanical} sizes="(max-width: 820px) 100vw, 46vw" /></div><figcaption className="mono muted">{botanical.alt.replace(/\.$/, "")}</figcaption></figure>}
      </section>
      <section className="pdp-ritual">
        <div className="wrap pdp-ritual-grid">
          <div className="ratio-4-5"><Photo asset={redClayAssets.ritual.hands} sizes="(max-width: 820px) 100vw, 40vw" /></div>
          <div className="pdp-ritual-copy">
            <p className="mono muted">Ritual</p>
            <p className="serif display-m">Coffee for the stillness of early light.</p>
            <p>Best as pour-over or batch filter, where the fruit has room to open.</p>
            <Link href="/shop/the-kiln-cup" className="pdp-ritual-pair"><span className="pdp-ritual-thumb"><Photo asset={redClayAssets.objects.kilnRakingLight} grade={false} sizes="96px" /></span><span className="text-link">Pair with The Kiln Cup — {formatKes(kilnCup.price)}</span></Link>
          </div>
        </div>
      </section>
    </>
  );
}

function MaterialStory({ product }: Readonly<{ product: Product }>) {
  const bags = [redClayAssets.products.materialLaterite, redClayAssets.products.materialBasalt, redClayAssets.products.materialLinen];
  return (
    <section className="wrap pdp-material">
      <div className="pdp-material-stage">
        {bags.map((asset) => <Image key={asset.id} className="cut" data-active={asset.id === product.media.photo?.id} src={asset.src} alt={asset.alt} width={444} height={680} sizes="15vw" />)}
      </div>
      <div className="pdp-material-copy">
        <p className="mono muted">The Material Series</p>
        <h2 className="serif display-s">A steady house profile, composed each season.</h2>
        <p>{product.placeCopy} The names are materials, used as metaphors; they say nothing about soil.</p>
        <div className="made-for">{product.uses.map((use) => <div key={use}><span className="mono muted">Made for</span><span className="serif">{use}</span></div>)}</div>
        <p>{product.comparison}</p>
      </div>
    </section>
  );
}

function KilnStory() {
  const care = [["Dishwasher safe", "Yes"], ["Microwave safe", "Yes"], ["Open flame or stovetop", "Avoid"], ["Sudden temperature change", "Avoid"], ["Hand washing keeps the exterior longer", "Tip"]];
  return (
    <>
      <section className="wrap pdp-kiln">
        <div className="pdp-kiln-lead ratio-4-5"><Photo asset={redClayAssets.objects.kilnPlinth} grade={false} sizes="(max-width: 820px) 100vw, 58vw" /></div>
        <div className="pdp-kiln-copy">
          <p className="mono muted">Form</p>
          <h2 className="serif display-s">A compact, gently tapered cup.</h2>
          <p>An exposed red stoneware body, high-fired and iron-rich, with a warm mineral-white satin glaze inside. The rim is glazed so it meets the lip smoothly; the outside is left bare to show the clay.</p>
          <div className="ratio-3-4"><Photo asset={redClayAssets.objects.kilnRakingLight} grade={false} sizes="(max-width: 820px) 100vw, 30vw" /></div>
        </div>
      </section>
      <section className="pdp-band">
        <div className="wrap pdp-care">
          <div className="pdp-care-dims"><ObjectArt kind="cup-dims" /></div>
          <div>
            <p className="mono muted">Care</p>
            <dl className="record">{care.map(([key, value]) => <div key={key}><dt>{key}</dt><dd className="mono">{value}</dd></div>)}</dl>
            <p className="small muted">Approximate figures; small variation is part of a fired object.</p>
          </div>
        </div>
      </section>
    </>
  );
}

function RegionsStory() {
  const contents = ["PLUM SEASON", "HONEY BLOOM", "JASMINE AIR"] as const;
  const regions = ["Central Kenya", "Kayanza / Burundi", "Southern Ethiopia"];
  return (
    <section className="pdp-band">
      <div className="wrap">
        <div className="section-head"><h2 className="serif display-m">Inside the box.</h2><p className="mono muted">3 × 100 g · one coffee per region</p></div>
        <div className="grid-3">
          {contents.map((id, index) => {
            const coffee = getProductById(id);
            if (!coffee || coffee.art.type !== "bag") return null;
            return <Link key={id} href={`/shop/${coffee.slug}`} className="regions-item">
              <span className="pv pv--studio ratio-1-1"><span className="pv-bag pv-bag--small"><PackageArt sku={coffee.art.key} weight="100 g" /></span></span>
              <span className="mono accent">0{index + 1} · {regions[index]}</span>
              <span className="serif display-s">{coffee.name}</span>
              <span className="small">{coffee.region} · {coffee.process} · {coffee.notes.join(" / ")}</span>
            </Link>;
          })}
        </div>
        <ol className="steps-3">
          <li><span className="mono">01</span>Brew all three the same way, with the same grinder setting and water.</li>
          <li><span className="mono">02</span>Taste them side by side, warm and again as they cool.</li>
          <li><span className="mono">03</span>Choose a full bag from the region that held your attention.</li>
        </ol>
      </div>
    </section>
  );
}

function RitualBand({ product }: Readonly<{ product: Product }>) {
  const asset = product.media.alternatePhoto ?? redClayAssets.ritual.pourOver;
  const isInstant = product.id === "RED CLAY INSTANT — ETHIOPIA";
  return (
    <section className="pdp-band">
      <div className="wrap pdp-ritual-grid">
        <div className="ratio-4-5"><Photo asset={asset} sizes="(max-width: 820px) 100vw, 40vw" /></div>
        <div className="pdp-ritual-copy">
          <p className="mono muted">{isInstant ? "How to make it" : "After dark"}</p>
          <h2 className="serif display-s">{product.placeHeading}</h2>
          <p>{product.placeCopy}</p>
        </div>
      </div>
    </section>
  );
}
