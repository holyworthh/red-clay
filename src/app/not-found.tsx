import Image from "next/image";
import Link from "next/link";
import { redClayAssets } from "@/lib/assets/registry";

export default function NotFound() {
  return (
    <main id="main-content" className="wrap not-found">
      <div className="not-found-copy">
        <p className="mono accent">404</p>
        <h1 className="serif display-l">This path has washed out.</h1>
        <p>The page you were looking for has moved or never existed. The coffee is still where you left it.</p>
        <div className="button-row"><Link className="button" href="/shop">Shop coffee</Link><Link className="text-link" href="/">Go home</Link></div>
      </div>
      <div className="not-found-media"><Image className="grade" src={redClayAssets.crops.redEarth.src} alt={redClayAssets.crops.redEarth.alt} fill sizes="(max-width: 820px) 100vw, 50vw" /></div>
    </main>
  );
}
