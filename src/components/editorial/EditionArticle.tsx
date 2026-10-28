import Image from "next/image";
import Link from "next/link";
import { ProductVisual } from "@/components/product/ProductVisual";
import { formatKes, getProductBySlug, type Product } from "@/content/coffees";
import { editions, type Edition } from "@/content/editions";

const figureClass = ["article-fig--inset", "article-fig--wide", "article-fig--right", "article-fig--wide", "article-fig--inset", "article-fig--right"];

export function EditionArticle({ edition }: { edition: Edition }) {
  const coffees = edition.connectedCoffees
    .map((connection) => ({ connection, product: getProductBySlug(connection.slug) }))
    .filter((item): item is { connection: Edition["connectedCoffees"][number]; product: Product } => item.product !== undefined);
  const next = editions[(editions.findIndex((item) => item.slug === edition.slug) + 1) % editions.length];

  return (
    <main id="main-content" className="article">
      <header className="wrap article-head">
        <p className="mono muted article-eyebrow"><Link href="/journal">Editions</Link> / Volume 01 — Place / Story {edition.storyOrdinal}</p>
        <h1 className="serif article-title">{edition.title}</h1>
        <p className="mono muted article-eyebrow">{edition.region} · {edition.sections.length} sections</p>
        <p className="serif article-subtitle">{edition.subtitle}</p>
      </header>
      {edition.leadAsset.src && (
        <figure className="wrap article-lead">
          <div className="article-lead-media"><Image className="grade" src={edition.leadAsset.src} alt={edition.leadAsset.alt} fill priority sizes="100vw" /></div>
          <figcaption className="mono muted">{edition.leadAsset.alt.replace(/\.$/, "")}</figcaption>
        </figure>
      )}

      <article className="wrap article-body">
        <p className="serif article-standfirst">{edition.standfirst}</p>
        {edition.sections.map((section, index) => (
          <section key={section.heading} className="article-section">
            <p className="mono accent article-label">{section.label}</p>
            <div className="article-text">
              <h2 className="serif display-m">{section.heading}</h2>
              {section.paragraphs.map((paragraph, pIndex) => <p key={paragraph} className={index === 0 && pIndex === 0 ? "dropcap" : undefined}>{paragraph}</p>)}
            </div>
            {section.asset?.src && (
              <figure className={`article-fig ${figureClass[index % figureClass.length]}`}>
                <div className="article-fig-media"><Image className="grade" src={section.asset.src} alt={section.asset.alt} fill sizes="(max-width: 820px) 100vw, 80vw" /></div>
                {section.caption && <figcaption className="mono muted">{section.caption}</figcaption>}
              </figure>
            )}
          </section>
        ))}
      </article>

      <section className="article-coffees">
        <div className="wrap article-coffees-grid">
          <div><p className="mono muted">Connected coffees</p><h2 className="serif display-s">{edition.coffeeHeading}</h2><p>{edition.coffeeBlurb}</p></div>
          <div className="grid-2">
            {coffees.map(({ connection, product }) => (
              <Link key={product.slug} href={`/shop/${product.slug}`} className="article-coffee">
                <span className="ratio-4-5"><ProductVisual product={product} sizes="15vw" /></span>
                <span className="article-coffee-copy"><span className="serif display-s">{product.name}</span><span className="small">{connection.blurb}</span><span>{formatKes(product.price)}</span></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="wrap article-sources" aria-labelledby="sources-title">
        <h2 id="sources-title" className="mono muted">Sources</h2>
        <ol>{edition.sources.map((source, index) => <li key={source.url}><span className="mono muted">0{index + 1}</span><span><a href={source.url} target="_blank" rel="noreferrer">{source.title}</a> — {source.organization}</span></li>)}</ol>
      </section>

      <nav className="wrap dossier-pager" aria-label="More reading">
        <Link href={`/origins/${edition.relatedOriginSlug}`}><span className="mono muted">Related dossier</span><span className="serif">{edition.region}</span></Link>
        <Link href={`/journal/${next.slug}`}><span className="mono muted">Next story · {next.storyOrdinal}</span><span className="serif">{next.title} →</span></Link>
      </nav>
    </main>
  );
}
