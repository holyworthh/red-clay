import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { editions } from "@/content/editions";
import { redClayAssets } from "@/lib/assets/registry";

export const metadata: Metadata = {
  title: "Editions",
  description: "Long-form writing about coffee as it is grown, handled and read, starting from three East African regions.",
};

export default function EditionsPage() {
  const [featured, second, third] = editions;
  return (
    <main id="main-content" className="editions">
      <section className="wrap editions-head">
        <div className="editions-masthead">
          <h1 className="serif editions-title">Editions</h1>
          <p className="mono muted editions-volume"><span>Volume 01 — Place</span><span>Three stories · Long-form</span></p>
        </div>
        <p className="serif display-s editions-intro">Writing about coffee as it is grown, handled and read. Each story starts from one region and refuses the convenient shorthand.</p>
      </section>

      <section className="wrap">
        <Link href={`/journal/${featured.slug}`} className="editions-featured">
          <span className="editions-featured-media"><Image className="grade" src={redClayAssets.documentary.homeProcess.src} alt={redClayAssets.documentary.homeProcess.alt} fill sizes="(max-width: 820px) 100vw, 66vw" priority /></span>
          <span className="editions-featured-copy">
            <span className="mono muted">Story {featured.storyOrdinal} · {featured.region}</span>
            <span className="serif editions-featured-title">{featured.title}</span>
            <span className="serif editions-dek">{featured.subtitle}</span>
            <span>{featured.cardDeck}</span>
            <span className="mono muted">{featured.sections.length} sections · {featured.sources.length} sources</span>
          </span>
        </Link>
      </section>

      <section className="wrap editions-pair">
        <Link href={`/journal/${second.slug}`} className="editions-story">
          <span className="ratio-3-4"><Image className="grade" src={second.leadAsset.src!} alt={second.leadAsset.alt} fill sizes="(max-width: 820px) 100vw, 40vw" /></span>
          <span className="mono muted">Story {second.storyOrdinal} · {second.region}</span>
          <span className="serif display-m">{second.title}</span>
          <span>{second.cardDeck}</span>
        </Link>
        <Link href={`/journal/${third.slug}`} className="editions-story editions-story--offset">
          <span className="ratio-4-3"><Image className="grade" src={third.leadAsset.src!} alt={third.leadAsset.alt} fill sizes="(max-width: 820px) 100vw, 50vw" /></span>
          <span className="mono muted">Story {third.storyOrdinal} · {third.region}</span>
          <span className="serif display-m">{third.title}</span>
          <span>{third.cardDeck}</span>
        </Link>
      </section>

      <section className="editions-contents">
        <div className="wrap editions-contents-grid">
          <p className="mono muted">Contents · Volume 01</p>
          <ol>
            {editions.map((edition) => (
              <li key={edition.slug}>
                <Link href={`/journal/${edition.slug}`}>
                  <span className="mono">{edition.storyOrdinal}</span>
                  <span><span className="serif display-s">{edition.title}</span><span className="small muted">{edition.subtitle}</span></span>
                  <span className="mono muted">{edition.region}</span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="wrap editions-next">
        <div>
          <p className="mono muted">Coming next</p>
          <p className="serif display-m">Volume 02 begins with the vessel.</p>
          <p>Clay, firing and the cup in the hand. New Editions arrive with the letters from the roastery.</p>
        </div>
        <div className="ratio-1-1"><Image src={redClayAssets.objects.kilnPlinth.src} alt={redClayAssets.objects.kilnPlinth.alt} fill sizes="(max-width: 820px) 100vw, 40vw" /></div>
      </section>
    </main>
  );
}
