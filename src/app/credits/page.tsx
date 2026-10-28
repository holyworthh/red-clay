import type { Metadata } from "next";
import { redClayAssets, type RedClayAsset } from "@/lib/assets/registry";

export const metadata: Metadata = { title: "Photo credits", description: "Sources, creators and licences for the documentary photography used on Red Clay." };

const credited = Object.values(redClayAssets)
  .flatMap((group) => Object.values(group) as RedClayAsset[])
  .filter((asset) => asset.creator && asset.license)
  .filter((asset, index, all) => all.findIndex((other) => other.sourcePage === asset.sourcePage) === index);

export default function CreditsPage() {
  return (
    <main id="main-content" className="wrap credits">
      <p className="mono muted">Photo credits</p>
      <h1 className="serif display-l">The photographs, and who made them.</h1>
      <p className="credits-intro">Documentary photography on this site is used under the licences below. Each image is captioned only with the place its source records. The people and places shown have no commercial relationship with Red Clay.</p>
      <ul className="credits-list">
        {credited.map((asset) => (
          <li key={asset.id}>
            <span className="serif">{asset.alt.replace(/\.$/, "")}</span>
            <span>{asset.creator} · {asset.license} · <a href={asset.sourcePage} rel="noopener noreferrer" target="_blank">Source</a></span>
          </li>
        ))}
      </ul>
      <p className="small muted">Product packshots, bag renders and The Kiln Cup photographs are Red Clay&rsquo;s own.</p>
    </main>
  );
}
