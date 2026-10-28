import Image from "next/image";
import Link from "next/link";
import { ProductVisual } from "@/components/product/ProductVisual";
import { formatKes, getProductBySlug, type Product } from "@/content/coffees";
import { editions } from "@/content/editions";
import type { Origin } from "@/content/origins";
import { redClayAssets, type RedClayAsset } from "@/lib/assets/registry";

function Photo({ asset, sizes }: Readonly<{ asset: RedClayAsset; sizes: string }>) {
  if (!asset.src) return null;
  return <Image className="grade" src={asset.src} alt={asset.alt} fill sizes={sizes} />;
}

const washedSteps = [
  { n: "01", t: "Select", d: "Ripe cherries are sorted from unripe, damaged and overripe fruit, by hand, by flotation, or both." },
  { n: "02", t: "Pulp", d: "A pulper removes the skin and much of the flesh. The seed stays in parchment, coated in mucilage." },
  { n: "03", t: "Ferment", d: "Microbial activity or mechanical demucilaging loosens the mucilage. Timing and hygiene matter more than length." },
  { n: "04", t: "Wash", d: "The parchment is washed. Channels can also help separate coffee by density." },
  { n: "05", t: "Dry", d: "On raised racks, tables or patios: spread, turned, covered and watched until moisture is stable." },
];

const kayanzaRoute = [
  { n: "01 · Plot", t: "Many small hillside stands", d: "Coffee is grown across steep, densely cultivated hills, often as a relatively small stand of trees beside other crops." },
  { n: "02 · Delivery", t: "Ripe cherry to the station", d: "Growers deliver cherry to a nearby washing station. The station is not the farm; it is where separate harvests enter a shared sequence." },
  { n: "03 · Station", t: "Received, sorted, batched", d: "Deliveries from many growers can be received, pre-sorted and processed in daily batches, with equipment, water, labour and record keeping." },
  { n: "04 · Process", t: "Washed, or dried in the fruit", d: "For washed coffee the cherry is depulped, mucilage removed and parchment washed. In a natural, the fruit stays on through drying." },
  { n: "05 · Drying", t: "Raised beds, turned by hand", d: "Coffee is spread, turned, covered and cleaned of defects until it reaches a stable moisture for storage." },
];

export function OriginDossier({ origin, nextOrigin, previousOrigin }: Readonly<{ origin: Origin; nextOrigin: Origin; previousOrigin: Origin }>) {
  const coffees = origin.coffeeSlugs.map((slug) => getProductBySlug(slug)).filter((product): product is Product => product !== undefined);
  const edition = editions.find((item) => item.slug === origin.editionSlug);
  const Layout = origin.layout === "vertical" ? VerticalDossier : origin.layout === "botanical" ? BotanicalDossier : StructuredDossier;
  return (
    <main id="main-content" className={`dossier dossier--${origin.layout}`}>
      <Layout origin={origin} coffees={coffees} />
      <section className="wrap dossier-end">
        {edition && (
          <Link href={`/journal/${edition.slug}`} className="dossier-edition">
            <span className="ratio-16-10"><Photo asset={edition.leadAsset} sizes="(max-width: 820px) 100vw, 55vw" /></span>
            <span className="dossier-edition-copy">
              <span className="mono muted">Edition {edition.storyOrdinal} · Related reading</span>
              <span className="serif display-m">{edition.title}</span>
              <span>{origin.relatedEditionBlurb}</span>
              <span className="text-link">Read the Edition</span>
            </span>
          </Link>
        )}
        <nav className="dossier-pager" aria-label="Other dossiers">
          <Link href={`/origins/${previousOrigin.slug}`}><span className="mono muted">Previous · {previousOrigin.number}</span><span className="serif">← {previousOrigin.name}</span></Link>
          <Link href={`/origins/${nextOrigin.slug}`}><span className="mono muted">Next dossier · {nextOrigin.number}</span><span className="serif">{nextOrigin.name} →</span></Link>
        </nav>
      </section>
    </main>
  );
}

function CoffeePair({ coffees, heading }: Readonly<{ coffees: Product[]; heading: string }>) {
  return (
    <section className="wrap dossier-coffees">
      <div className="section-rule"><h2 className="serif display-m">{heading}</h2></div>
      <div className="dossier-coffee-grid">
        {coffees.map((coffee) => (
          <Link key={coffee.slug} href={`/shop/${coffee.slug}`} className="dossier-coffee">
            <span className="ratio-4-5"><ProductVisual product={coffee} sizes="(max-width: 820px) 50vw, 22vw" /></span>
            <span className="dossier-coffee-copy">
              <span className="mono muted">{coffee.region.split(",")[0]} · {coffee.process} · {coffee.lotCode}</span>
              <span className="serif display-s">{coffee.name}</span>
              <span>{coffee.shortDescription}</span>
              <span>{formatKes(coffee.price)}</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function StructuredDossier({ origin, coffees }: Readonly<{ origin: Origin; coffees: Product[] }>) {
  return (
    <>
      <section className="wrap dossier-head">
        <nav className="mono muted crumbs" aria-label="Breadcrumb"><Link href="/origins">Origins</Link> / Dossier {origin.number}</nav>
        <div className="dossier-head-grid">
          <h1 className="serif display-xl">{origin.name}</h1>
          <p className="serif dossier-descriptor">{origin.descriptor}</p>
        </div>
      </section>
      <figure className="wrap dossier-hero">
        <div className="dossier-hero-media"><Photo asset={redClayAssets.documentary.kiambuLead} sizes="100vw" /></div>
        <figcaption className="mono muted"><span>Fairview Estate, Kiambu, Kenya</span><span>Plate {origin.number}</span></figcaption>
      </figure>
      <section className="wrap dossier-intro">
        <dl className="dossier-facts">
          <dt className="mono muted">Dossier</dt><dd>Country · {origin.country}</dd><dd>Regions · Kiambu, Kirinyaga</dd><dd>Process · Washed</dd><dd>Coffees · {coffees.map((coffee) => coffee.name).join(", ")}</dd>
        </dl>
        <div className="dossier-intro-copy">
          <p className="serif display-s">{origin.summary}</p>
          <div className="grid-2">
            <div><p className="mono muted">{origin.headings.place}</p><p>{origin.place}</p></div>
            <div><p className="mono muted">{origin.headings.context}</p><p>{origin.context}</p></div>
          </div>
        </div>
      </section>
      <section className="dossier-band">
        <div className="wrap">
          <div className="section-head"><h2 className="serif display-m">{origin.headings.process}</h2><p className="mono muted">Five stages · cherry to dry parchment</p></div>
          <ol className="steps-5">{washedSteps.map((step) => <li key={step.n}><span className="mono accent">{step.n}</span><span className="serif display-s">{step.t}</span><span className="small">{step.d}</span></li>)}</ol>
          <p className="dossier-note">Kenya also produces natural and honey coffees, so “Kenyan” and “washed” are not interchangeable terms.</p>
        </div>
      </section>
      <section className="wrap dossier-work">
        <figure><div className="ratio-4-5"><Photo asset={redClayAssets.origins.kenyaProcess} sizes="(max-width: 820px) 100vw, 40vw" /></div><figcaption className="mono muted">Sorting cherries, Kenya</figcaption></figure>
        <div className="dossier-work-copy">
          <p className="mono muted">The work</p>
          <h2 className="serif display-m">{origin.headings.work}</h2>
          <p>{origin.work}</p>
          <div className="grid-2">
            <figure><div className="ratio-1-1"><Photo asset={redClayAssets.documentary.kiambuCultivation} sizes="20vw" /></div><figcaption className="mono muted">Unripe berries, Kiambu</figcaption></figure>
            <figure><div className="ratio-1-1"><Photo asset={redClayAssets.documentary.kenyaWashingInfrastructure} sizes="20vw" /></div><figcaption className="mono muted">Washing pits (inactive), Kiambu</figcaption></figure>
          </div>
        </div>
      </section>
      <CoffeePair coffees={coffees} heading={origin.headings.coffees} />
      <Facts origin={origin} dark />
    </>
  );
}

function VerticalDossier({ origin, coffees }: Readonly<{ origin: Origin; coffees: Product[] }>) {
  return (
    <>
      <section className="wrap dossier-head dossier-head--center">
        <nav className="mono muted crumbs" aria-label="Breadcrumb"><Link href="/origins">Origins</Link> / Dossier {origin.number}</nav>
        <p className="mono accent-gold">{origin.number}</p>
        <h1 className="serif display-xl">{origin.name}</h1>
        <p className="serif dossier-descriptor">{origin.descriptor}</p>
      </section>
      <section className="wrap dossier-tall">
        <figure><div className="ratio-3-4"><Photo asset={redClayAssets.origins.burundiLead} sizes="(max-width: 820px) 100vw, 55vw" /></div><figcaption className="mono muted">Processing landscape, Kayanza</figcaption></figure>
        <figure className="dossier-tall-offset"><div className="ratio-2-3"><Photo asset={redClayAssets.origins.burundiSupport} sizes="(max-width: 820px) 100vw, 44vw" /></div><figcaption className="mono muted">Hillside landscape, Burundi</figcaption></figure>
      </section>
      <section className="wrap narrow dossier-lede"><p className="serif display-s">{origin.summary}</p><p>{origin.place}</p></section>
      <section className="dossier-band dossier-band--light">
        <div className="wrap narrow">
          <p className="mono muted">The route</p>
          <h2 className="serif display-m">{origin.headings.place}</h2>
          <ol className="route">{kayanzaRoute.map((step) => <li key={step.n}><span className="route-dot" aria-hidden="true" /><span className="mono accent-gold">{step.n}</span><span className="serif display-s">{step.t}</span><span className="small">{step.d}</span></li>)}</ol>
        </div>
      </section>
      <section className="wrap dossier-split">
        <div><p className="mono muted">The work</p><h2 className="serif display-m">{origin.headings.work}</h2><p>{origin.work}</p></div>
        <figure><div className="ratio-4-5"><Photo asset={redClayAssets.origins.burundiBotanical} sizes="(max-width: 820px) 100vw, 50vw" /></div><figcaption className="mono muted">Coffee cherries and leaves, Burundi</figcaption></figure>
      </section>
      <CoffeePair coffees={coffees} heading={origin.headings.coffees} />
      <Facts origin={origin} />
    </>
  );
}

function BotanicalDossier({ origin, coffees }: Readonly<{ origin: Origin; coffees: Product[] }>) {
  return (
    <>
      <section className="wrap dossier-head dossier-head--sheet">
        <nav className="mono muted crumbs" aria-label="Breadcrumb"><Link href="/origins">Origins</Link> / Dossier {origin.number}</nav>
        <div className="dossier-sheet-grid">
          <div>
            <h1 className="serif display-xl">{origin.name}</h1>
            <p className="serif dossier-descriptor">{origin.descriptor}</p>
            <p>{origin.summary}</p>
          </div>
          <div className="sheet">
            <div className="ratio-4-5"><Photo asset={redClayAssets.origins.ethiopiaLead} sizes="(max-width: 820px) 100vw, 40vw" /></div>
            <dl className="tag"><dt>Plate</dt><dd>{origin.number} · Coffee sorting</dd><dt>Place</dt><dd>Ethiopia</dd><dt>Note</dt><dd>Process context only; not a Sidama or Guji record.</dd></dl>
          </div>
        </div>
      </section>
      <section className="dossier-band">
        <div className="wrap dossier-cherry">
          <div><p className="mono muted">Before the bean</p><h2 className="serif display-m">Coffee is a fruit before it is a bean.</h2><p>A coffee cherry has an outer skin and pulp, a sticky layer called mucilage, a papery parchment layer, a thin silver skin and usually two seeds. {origin.process}</p></div>
          <figure>
            <svg viewBox="0 0 560 360" role="img" aria-label="Cross-section of a coffee cherry: skin, pulp, mucilage, parchment and two seeds">
              <ellipse cx="190" cy="180" rx="150" ry="160" fill="#8F2F2A" /><ellipse cx="190" cy="180" rx="136" ry="146" fill="#C9614D" /><ellipse cx="190" cy="180" rx="112" ry="122" fill="#E9C9A6" opacity=".85" />
              <g fill="#E9E2D2" stroke="#B8A98E" strokeWidth="2"><path d="M190 72 C 120 80, 104 150, 108 196 C 112 252, 150 286, 186 288 Z" /><path d="M194 72 C 264 80, 280 150, 276 196 C 272 252, 234 286, 198 288 Z" /></g>
              <g fill="#CDBE9F"><path d="M186 88 C 134 98, 122 152, 126 196 C 130 244, 158 270, 184 272 C 176 220, 176 140, 186 88 Z" /><path d="M198 88 C 250 98, 262 152, 258 196 C 254 244, 226 270, 200 272 C 208 220, 208 140, 198 88 Z" /></g>
              <g stroke="#5C5B57" strokeWidth="1" fill="none"><line x1="300" y1="70" x2="380" y2="54" /><line x1="306" y1="120" x2="380" y2="110" /><line x1="290" y1="170" x2="380" y2="166" /><line x1="270" y1="214" x2="380" y2="222" /><line x1="246" y1="250" x2="380" y2="278" /></g>
              <g fontFamily="var(--font-mono), monospace" fontSize="11" letterSpacing="1" fill="#1C1917"><text x="388" y="58">SKIN</text><text x="388" y="114">PULP</text><text x="388" y="170">MUCILAGE</text><text x="388" y="226">PARCHMENT</text><text x="388" y="282">SEED · TWO PER CHERRY</text></g>
            </svg>
            <figcaption className="mono muted">Fig. 1 · Coffee cherry, simplified section</figcaption>
          </figure>
        </div>
      </section>
      <section className="wrap dossier-specimens">
        <div className="section-head"><h2 className="serif display-m">{origin.headings.place}</h2><p className="mono muted">Specimen comparison</p></div>
        <div className="grid-2">
          {coffees.map((coffee, index) => (
            <article key={coffee.slug} className="sheet">
              <div className="sheet-top">
                <span className="ratio-4-5"><ProductVisual product={coffee} sizes="20vw" /></span>
                <span><span className="mono muted">Specimen {index === 0 ? "A" : "B"}</span><span className="serif display-m">{coffee.region.split(",")[0]}</span><span className="serif dossier-descriptor">{coffee.name}</span></span>
              </div>
              <dl className="tag"><dt>Region</dt><dd>{coffee.region}</dd><dt>Process</dt><dd>{coffee.process}</dd><dt>Varieties</dt><dd>{coffee.varieties}</dd><dt>Notes</dt><dd>{coffee.notes.join(" / ")}</dd><dt>Price</dt><dd>{formatKes(coffee.price)}</dd></dl>
              <Link href={`/shop/${coffee.slug}`} className="line-link"><span>View {coffee.name}</span><span aria-hidden="true">→</span></Link>
            </article>
          ))}
        </div>
      </section>
      <section className="dossier-dark">
        <div className="wrap dossier-dark-grid">
          <div><p className="mono">Beneath the word</p><h2 className="serif display-m">{origin.headings.context}</h2><p>{origin.context}</p><Link className="text-link" href="/journal/beyond-heirloom">Read Edition 03 · Beyond “Heirloom”</Link></div>
          <div className="grid-2">
            <figure><div className="ratio-3-4"><Photo asset={redClayAssets.origins.ethiopiaDetail} sizes="25vw" /></div><figcaption className="mono">Quality sorting, Ethiopia</figcaption></figure>
            <figure className="offset-down"><div className="ratio-3-4"><Photo asset={redClayAssets.origins.ethiopiaSupport} sizes="25vw" /></div><figcaption className="mono">Sorting by size, Ethiopia</figcaption></figure>
          </div>
        </div>
      </section>
      <section className="wrap dossier-split dossier-split--text"><div><p className="mono muted">The work</p><h2 className="serif display-s">{origin.headings.work}</h2></div><p>{origin.work}</p></section>
      <Facts origin={origin} />
    </>
  );
}

function Facts({ origin, dark = false }: Readonly<{ origin: Origin; dark?: boolean }>) {
  return (
    <section className={dark ? "dossier-dark" : "wrap dossier-facts-list"}>
      <div className={dark ? "wrap dossier-facts-grid" : "dossier-facts-grid"}>
        <p className="mono">{origin.headings.facts}</p>
        <ol>{origin.factualContext.map((fact, index) => <li key={fact}><span className="mono">0{index + 1}</span><span className="serif">{fact}</span></li>)}</ol>
      </div>
    </section>
  );
}
