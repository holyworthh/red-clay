import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { formatKes, kilnCup } from "@/content/coffees";
import { redClayAssets } from "@/lib/assets/registry";

export const metadata: Metadata = { title: "About", description: "Red Clay is a contemporary African coffee house in Nairobi, built around coffee, place, and objects for daily use." };

const steps = [
  { id: "earth", n: "01", name: "Earth" },
  { id: "coffee", n: "02", name: "Coffee" },
  { id: "vessel", n: "03", name: "Vessel" },
  { id: "ritual", n: "04", name: "Ritual" },
];

const principles = [
  { n: "01", t: "Clarity before spectacle.", d: "We choose coffees and roast them to be read clearly in the cup, not to impress on the first sip." },
  { n: "02", t: "Place is context, not a guarantee.", d: "A region, a variety or a process tells you something real. None of them predicts the cup on its own, and we don’t pretend otherwise." },
  { n: "03", t: "Say only what we know.", d: "No invented producer quotes, no unsupported sourcing claims. When something is unverified, we leave it out." },
  { n: "04", t: "Objects for daily use.", d: "One cup, made to be used every morning. Coffee comes first; the object serves it." },
];

export default function AboutPage() {
  const bags = [redClayAssets.products.materialLaterite, redClayAssets.products.materialBasalt, redClayAssets.products.materialLinen];
  return (
    <main id="main-content" className="about">
      <section className="wrap about-head">
        <p className="mono muted">About Red Clay</p>
        <h1 className="serif display-xl">A contemporary African coffee house, built around the material character of place.</h1>
        <p className="about-head-copy">Red Clay is an independent roastery in Nairobi working with East African coffees, objects for daily use, and writing that takes place seriously. We roast in small batches and try to say only what we know.</p>
      </section>
      <figure className="wrap about-hero">
        <div className="about-hero-media"><Image className="grade" src={redClayAssets.crops.redEarth.src} alt={redClayAssets.crops.redEarth.alt} fill priority sizes="100vw" style={{ objectPosition: "center 70%" }} /></div>
        <figcaption className="mono muted">Red earth, Fairview Estate, Kiambu</figcaption>
      </figure>
      <nav className="wrap about-steps" aria-label="The continuum">
        {steps.map((step) => <a key={step.id} href={`#${step.id}`}><span className="mono accent">{step.n}</span><span className="serif display-s">{step.name}</span></a>)}
      </nav>

      <section id="earth" className="wrap about-row">
        <div className="ratio-3-4"><Image className="grade" src={redClayAssets.architecture.hero.src} alt={redClayAssets.architecture.hero.alt} fill sizes="(max-width: 820px) 100vw, 40vw" /></div>
        <div className="about-row-copy">
          <p className="mono muted">01 · Earth</p>
          <h2 className="serif display-m">Laterite, basalt, linen.</h2>
          <p>Our palette and our names come from materials of the region: iron-red earth, dark volcanic stone, raw linen. They describe a feeling, not a flavour. Laterite, Basalt and Linen are house coffees with steady profiles; the names are metaphors, not claims about soil or terroir.</p>
          <div className="about-swatches">
            <span className="ratio-1-1"><Image src={redClayAssets.materials.clay.src} alt={redClayAssets.materials.clay.alt} fill sizes="12vw" /></span>
            <span className="ratio-1-1"><Image src={redClayAssets.materials.stone.src} alt={redClayAssets.materials.stone.alt} fill sizes="12vw" /></span>
            <span className="ratio-1-1 about-linen" role="img" aria-label="Linen colour swatch" />
          </div>
        </div>
      </section>

      <section id="coffee" className="about-band">
        <div className="wrap about-row about-row--flip">
          <div className="about-row-copy">
            <p className="mono muted">02 · Coffee</p>
            <h2 className="serif display-m">Three highland regions. Three ways into the coffee.</h2>
            <p>Central Kenya, Kayanza in Burundi and Southern Ethiopia. Six Current Harvest coffees, each named for its character and labelled with its place and process. We describe a region as context, never as a guarantee of taste.</p>
            <Link className="text-link" href="/origins">Open The Earthen Folio</Link>
          </div>
          <div className="about-trio">
            <span className="ratio-3-4"><Image className="grade" src={redClayAssets.documentary.kiambuLead.src} alt={redClayAssets.documentary.kiambuLead.alt} fill sizes="16vw" /></span>
            <span className="ratio-3-5"><Image className="grade" src={redClayAssets.origins.burundiLead.src} alt={redClayAssets.origins.burundiLead.alt} fill sizes="16vw" /></span>
            <span className="ratio-3-4"><Image className="grade" src={redClayAssets.origins.ethiopiaDetail.src} alt={redClayAssets.origins.ethiopiaDetail.alt} fill sizes="16vw" /></span>
          </div>
        </div>
      </section>

      <section id="vessel" className="wrap about-row">
        <div className="ratio-4-5"><Image src={redClayAssets.objects.kilnPlinth.src} alt={redClayAssets.objects.kilnPlinth.alt} fill sizes="(max-width: 820px) 100vw, 45vw" /></div>
        <div className="about-row-copy">
          <p className="mono muted">03 · Vessel</p>
          <h2 className="serif display-m">Clay outside. Glaze within.</h2>
          <p>The Kiln Cup is our one companion object: high-fired, iron-rich stoneware with an exposed red exterior and a warm white interior. It is made for daily use, and it should never become more important than the coffee in it.</p>
          <Link className="text-link" href="/shop/the-kiln-cup">The Kiln Cup · {formatKes(kilnCup.price)}</Link>
        </div>
      </section>

      <section id="ritual" className="about-dark">
        <div className="wrap about-row about-row--flip">
          <div className="about-row-copy">
            <p className="mono">04 · Ritual</p>
            <h2 className="serif display-m">Coffee for the stillness of early light.</h2>
            <p>The last step is yours: the grinder, the kettle, the first cup before the day starts. Everything before it should make that moment quieter, not louder.</p>
          </div>
          <div className="ratio-4-3"><Image className="grade" src={redClayAssets.ritual.hands.src} alt={redClayAssets.ritual.hands.alt} fill sizes="(max-width: 820px) 100vw, 50vw" /></div>
        </div>
      </section>

      <section className="wrap about-principles">
        <p className="mono muted">How we work</p>
        <ol>{principles.map((item) => <li key={item.n}><span className="mono muted">{item.n}</span><span className="serif display-s">{item.t}</span><span>{item.d}</span></li>)}</ol>
      </section>

      <section className="wrap about-close">
        <div className="about-close-bags">{bags.map((asset) => <Image key={asset.id} className="cut" src={asset.src} alt={asset.alt} width={444} height={680} sizes="14vw" />)}</div>
        <div className="about-row-copy">
          <p className="serif display-m">Roasted in Nairobi.</p>
          <p>Small batches. Orders leave the roastery within 1–2 business days. Free delivery anywhere in Kenya from KES 5,000.</p>
          <Link className="button" href="/shop">Shop coffee</Link>
        </div>
      </section>
    </main>
  );
}
