import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ProductVisual } from "@/components/product/ProductVisual";
import { formatKes, getProductBySlug } from "@/content/coffees";
import { origins } from "@/content/origins";
import { redClayAssets } from "@/lib/assets/registry";

export const metadata: Metadata = {
  title: "Origins — The Earthen Folio",
  description: "Three highland regions, three ways into the coffee: Central Kenya, Kayanza in Burundi, and Southern Ethiopia.",
};

const chapterStyle = {
  "central-kenya": { accent: "#9A3B22", plate: redClayAssets.documentary.kiambuLead, plateCaption: "Fairview Estate, Kiambu, Kenya", support: redClayAssets.origins.kenyaProcess, supportCaption: "Sorting cherries, Kenya", tone: "" },
  "kayanza-burundi": { accent: "#8A6A3F", plate: redClayAssets.origins.burundiLead, plateCaption: "Processing landscape, Kayanza, Burundi", support: redClayAssets.origins.burundiSupport, supportCaption: "Hillside landscape, Burundi", tone: "folio-chapter--warm" },
  "southern-ethiopia": { accent: "#5E2D35", plate: redClayAssets.origins.ethiopiaLead, plateCaption: "Coffee sorting, Ethiopia", support: redClayAssets.origins.ethiopiaDetail, supportCaption: "Quality sorting, Ethiopia", tone: "" },
} as const;

export default function OriginsPage() {
  return (
    <main id="main-content" className="folio">
      <section className="wrap folio-head">
        <div className="folio-head-title">
          <p className="mono muted">Origins · The Earthen Folio</p>
          <h1 className="serif display-xl">Three highland regions. Three ways into the coffee.</h1>
        </div>
        <div className="folio-head-side">
          <p>A short monograph in three chapters. Each one places two coffees in a landscape, a process and a cup. The region names locate a coffee; they never stand in for its flavour.</p>
          <nav className="folio-toc" aria-label="Chapters">
            {origins.map((origin) => <a key={origin.slug} href={`#${origin.slug}`}><span className="mono accent">{origin.number}</span><span className="serif">{origin.name}</span></a>)}
          </nav>
        </div>
      </section>

      <nav id="folio" className="folio-bar" aria-label="Chapter navigation">
        <div className="wrap folio-bar-inner mono">
          <span>The Earthen Folio</span>
          {origins.map((origin) => <a key={origin.slug} href={`#${origin.slug}`}>{origin.number} {origin.name}</a>)}
        </div>
      </nav>

      {origins.map((origin) => {
        const style = chapterStyle[origin.slug as keyof typeof chapterStyle];
        const coffees = origin.coffeeSlugs.map((slug) => getProductBySlug(slug)).filter((product) => product !== undefined);
        return (
          <section key={origin.slug} id={origin.slug} className={`folio-chapter ${style.tone}`} aria-labelledby={`${origin.slug}-title`}>
            <div className="wrap folio-chapter-grid">
              <figure className="folio-plate">
                <div className="folio-plate-media">
                  <Image className="grade" src={style.plate.src} alt={style.plate.alt} fill sizes="(max-width: 900px) 100vw, 58vw" />
                  <span className="mono folio-plate-index">{origin.number} / 03</span>
                </div>
                <figcaption className="mono muted"><span>{style.plateCaption}</span><span>Plate {origin.number}</span></figcaption>
              </figure>
              <div className="folio-text">
                <div>
                  <p className="serif folio-number" style={{ color: style.accent }} aria-hidden="true">{origin.number}</p>
                  <h2 id={`${origin.slug}-title`} className="serif display-m">{origin.name}</h2>
                  <p className="serif folio-descriptor">{origin.descriptor}</p>
                </div>
                <dl className="folio-hub">
                  <dt className="mono muted">Place</dt><dd>{origin.hub.place}</dd>
                  <dt className="mono muted">Process</dt><dd>{origin.hub.process}</dd>
                  <dt className="mono muted">Cup</dt><dd>{origin.hub.cup}</dd>
                </dl>
                <div className="folio-block"><p className="mono muted">{origin.headings.place}</p><p>{origin.place}</p></div>
                <figure className="folio-support"><div className="ratio-4-3"><Image className="grade" src={style.support.src} alt={style.support.alt} fill sizes="(max-width: 900px) 100vw, 30vw" /></div><figcaption className="mono muted">{style.supportCaption}</figcaption></figure>
                <div className="folio-block"><p className="mono muted">{origin.headings.work}</p><p>{origin.work}</p></div>
                <div className="folio-coffees">
                  <p className="mono muted">Two coffees from this chapter</p>
                  <div className="grid-2">
                    {coffees.map((coffee) => (
                      <Link key={coffee.slug} href={`/shop/${coffee.slug}`} className="folio-coffee">
                        <span className="ratio-4-5"><ProductVisual product={coffee} sizes="15vw" /></span>
                        <span className="serif">{coffee.name}</span>
                        <span className="small muted">{coffee.region.split(",")[0]} · {coffee.notes.join(" / ")}</span>
                      </Link>
                    ))}
                  </div>
                </div>
                <Link href={`/origins/${origin.slug}`} className="line-link"><span>Read the {origin.name} dossier</span><span aria-hidden="true">→</span></Link>
              </div>
            </div>
          </section>
        );
      })}

      <section className="wrap folio-after">
        <div className="ratio-1-1"><Image className="grade" src={redClayAssets.documentary.kenyaDryingTexture.src} alt={redClayAssets.documentary.kenyaDryingTexture.alt} fill sizes="(max-width: 820px) 100vw, 40vw" /></div>
        <div className="folio-after-copy">
          <p className="mono muted">After the Folio</p>
          <p className="serif display-m">Taste the three regions side by side.</p>
          <p>Three Regions holds 100 g each of Plum Season, Honey Bloom and Jasmine Air. Taste the collection by place before choosing a full bag.</p>
          <div className="button-row"><Link className="button" href="/shop/three-regions">Shop Three Regions</Link><span>{formatKes(getProductBySlug("three-regions")?.price ?? null)}</span><Link className="text-link" href="/journal">Or read the Editions</Link></div>
        </div>
      </section>
    </main>
  );
}
