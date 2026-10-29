/**
 * The motion plan: which elements get which entrance. Shared by the server (the
 * pre-hide <style> in the root layout) and the client runtime (scenes.ts), so the
 * two can never drift. See docs/red-clay/09_MOTION_INTERACTION_SYSTEM.md.
 */

// Surfaces with their own behaviour, or none at all.
const EXCLUDE = ":not(.hero *):not(.home-continuum *):not(.checkout *):not(.bag *):not(.gallery *):not(.folio-plate *):not(.product-card *)";

const scoped = (list: string[]) => list.map((s) => `${s}${EXCLUDE}`).join(", ");

export const MOTION = {
  lines: scoped([
    "main h1",
    "main .display-xl", "main .display-l", "main .display-m", "main h2.display-s",
    "main .home-edition-title", "main .editions-featured-title", "main .editions-title",
    "main .article-title", "main .article-standfirst", "main .pdp-title", "main .folio-descriptor",
    "main .home-material-caption h2",
    "footer .site-footer-pitch",
  ]),
  fade: scoped([
    "main p.mono", "main .section-head .text-link", "main .button-row", "main .line-link",
    "main .folio-hub", "main .folio-block", "main .folio-coffees", "main .folio-toc",
    "main .home-kiln-copy > p:not(.mono)", "main .home-origin-caption", "main .home-continuum-item figcaption",
    "main .pdp-lede", "main .record", "main .made-for", "main .buy > *:not(.buy-bar)",
    "main .steps-3 > *", "main .steps-5 > *", "main .dossier-facts", "main .route",
    "main .editions-contents li", "main .editions-story > span:not([class*=\"ratio-\"])",
    "main .article-text > *", "main .article-sources", "main .about-row-copy > p:not(.mono)",
    "main .folio-after-copy > p:not(.mono):not(.display-m)", "main .regions-item > span:not([class*=\"ratio-\"])",
    "main figcaption",
    "footer .site-footer-links", "footer .site-footer-field", "footer .site-footer-base > *",
  ]),
  mask: scoped([
    "main [class*=\"ratio-\"]", "main .home-origin-media", "main .pdp-place-media", "main .dossier-hero-media",
    "main .article-lead-media", "main .about-hero-media", "main .shop-interlude-media",
    "main .editions-featured-media", "main .article-fig-media", "main .home-kiln-ritual", "main .home-kiln-object",
  ]),
  parallax: scoped([
    "main .pdp-place-media", "main .dossier-hero-media", "main .article-lead-media", "main .about-hero-media",
    "main .shop-interlude-media", "main .home-origin-media", "main .editions-featured-media", "main .home-kiln-ritual",
  ]),
  cards: "main .product-card",
  rule: scoped(["main .section-rule"]),
} as const;

export type RevealDir = "up" | "down" | "left" | "right";

/**
 * Which way each image plate opens ("left" = the reveal travels leftward, from the right
 * edge). Anything unlisted opens upward. Paired plates open toward each other; heroes of
 * reading pages drop from the top like a page being lowered.
 */
export const MASK_DIRECTIONS: Array<[string, RevealDir]> = [
  [".home-origin--kenya .home-origin-media", "left"],
  [".home-origin--burundi .home-origin-media", "right"],
  [".home-kiln-ritual", "right"],
  [".home-kiln-object", "left"],
  [".editions-featured-media", "right"],
  [".editions-story:not(.editions-story--offset) [class*=\"ratio-\"]", "down"],
  [".editions-story--offset [class*=\"ratio-\"]", "left"],
  [".article-lead-media, .dossier-hero-media, .about-hero-media, .pdp-place-media", "down"],
  [".shop-interlude-media", "left"],
  [".folio-after > [class*=\"ratio-\"]", "right"],
  [".folio-support [class*=\"ratio-\"]", "left"],
  [".about-row:not(.about-row--flip) [class*=\"ratio-\"]", "right"],
  [".about-row--flip [class*=\"ratio-\"]", "left"],
  [".pdp-process-main [class*=\"ratio-\"]", "right"],
  [".pdp-process-botanical [class*=\"ratio-\"]", "left"],
  [".dossier-tall-offset [class*=\"ratio-\"]", "down"],
];

// Hidden before the runtime starts (only while html.js-motion is set).
const PREHIDE = [
  MOTION.lines, MOTION.fade, MOTION.mask, MOTION.cards, MOTION.rule,
  ".hero-media", ".hero-bottom",
];

export const prehideCss = `html.js-motion :is(${PREHIDE.join(", ")}) { visibility: hidden; }`;

/**
 * Runs before first paint. Enables motion unless reduced motion is requested, plays the
 * intro once per session, and drops everything back to static if the runtime never starts.
 */
export const bootScript = `(function(){try{
var d=document.documentElement;if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
d.classList.add('js-motion');
try{if(!sessionStorage.getItem('rc-intro')){d.classList.add('rc-intro');sessionStorage.setItem('rc-intro','1');}}catch(e){}
setTimeout(function(){if(!window.__rcMotion){d.classList.remove('js-motion','rc-intro');}},4000);
}catch(e){}})();`;
