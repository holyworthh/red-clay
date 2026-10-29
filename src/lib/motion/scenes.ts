import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { MASK_DIRECTIONS, MOTION, type RevealDir } from "@/lib/motion/plan";

gsap.registerPlugin(ScrollTrigger, SplitText);

const DESKTOP_STAGE = "(min-width: 1024px) and (min-height: 640px)";
/** One-shot trigger; clamp() keeps elements near the page bottom reachable. */
const once = (trigger: Element, start = "top 88%") => ({ trigger, start: `clamp(${start})`, once: true });
const all = <T extends Element = HTMLElement>(root: ParentNode, selector: string) => Array.from(root.querySelectorAll<T & HTMLElement>(selector));
/** Show a pre-hidden element by deferring to its parent's visibility. */
const unhide = (el: Element | Element[]) => gsap.set(el, { visibility: "inherit" });
const insideLink = (el: Element) => !!el.closest("a, button");

/** Closed clip for each reveal direction; every reveal opens to OPEN. */
const CLIP: Record<RevealDir, string> = {
  up: "inset(100% 0% 0% 0%)",
  down: "inset(0% 0% 100% 0%)",
  left: "inset(0% 0% 0% 100%)",
  right: "inset(0% 100% 0% 0%)",
};
const OPEN = "inset(0% 0% 0% 0%)";
const directionOf = (el: Element): RevealDir => MASK_DIRECTIONS.find(([selector]) => el.matches(selector))?.[1] ?? "up";
/** The image travels a little with the reveal on horizontal wipes. */
const settleFrom = (dir: RevealDir) => (dir === "left" ? { xPercent: 6 } : dir === "right" ? { xPercent: -6 } : {});

/* ---------- Generic reveals ---------- */

function splitLines(el: HTMLElement, vars: (lines: Element[]) => gsap.TweenVars, start = "top 88%") {
  SplitText.create(el, {
    type: "lines",
    mask: "lines",
    autoSplit: true,
    aria: insideLink(el) ? "none" : "auto",
    onSplit(self) {
      gsap.set(el, { visibility: "inherit" });
      return gsap.from(self.lines, { ...vars(self.lines), scrollTrigger: once(el, start) });
    },
  });
}

function revealLines(root: ParentNode) {
  for (const el of all(root, MOTION.lines)) {
    splitLines(el, () => ({ yPercent: 110, duration: 1.15, ease: "expo.out", stagger: 0.08 }));
  }
}

function revealFades(root: ParentNode, taken: Set<Element>) {
  const set = all(root, MOTION.fade).filter((el) => !taken.has(el));
  const candidates = new Set(set);
  // Nested matches ride along with their outermost animated ancestor.
  const roots = set.filter((el) => {
    let parent = el.parentElement;
    while (parent) { if (candidates.has(parent)) { unhide(el); return false; } parent = parent.parentElement; }
    return true;
  });
  ScrollTrigger.batch(roots, {
    start: "clamp(top 90%)",
    once: true,
    onEnter: (batch) => gsap.fromTo(batch, { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 1, ease: "power3.out", stagger: 0.08, overwrite: true }),
  });
}

function revealMasks(root: ParentNode) {
  const parallax = new Set(all(root, MOTION.parallax));
  for (const box of all(root, MOTION.mask)) {
    const img = box.querySelector("img");
    if (!img) { unhide(box); continue; }
    const base = parallax.has(box) ? 1.16 : 1;
    const dir = directionOf(box);
    img.dataset.baseScale = String(base);
    gsap.set(img, { scale: base, transformOrigin: "50% 50%" });
    gsap.timeline({ scrollTrigger: once(box, "top 92%") })
      .fromTo(box, { clipPath: CLIP[dir], autoAlpha: 1 }, { clipPath: OPEN, duration: 1.35, ease: "expo.inOut", clearProps: "clipPath" })
      .from(img, { scale: base + 0.22, ...settleFrom(dir), duration: 1.8, ease: "expo.out" }, 0);
  }
  for (const box of parallax) {
    const img = box.querySelector("img");
    if (!img) continue;
    gsap.fromTo(img, { yPercent: -7 }, { yPercent: 7, ease: "none", scrollTrigger: { trigger: box, start: "top bottom", end: "bottom top", scrub: true } });
  }
}

function revealCards(root: ParentNode) {
  ScrollTrigger.batch(all(root, MOTION.cards), {
    start: "clamp(top 92%)",
    once: true,
    onEnter: (batch) => gsap.fromTo(batch, { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 1.2, ease: "expo.out", stagger: 0.1, overwrite: true }),
  });
}

function revealRules(root: ParentNode) {
  for (const el of all(root, MOTION.rule)) {
    gsap.fromTo(el, { clipPath: "inset(0% 100% 0% 0%)", autoAlpha: 1 }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease: "expo.inOut", clearProps: "clipPath", scrollTrigger: once(el) });
  }
}

/* ---------- Signature scenes ---------- */

function heroScene(root: ParentNode, delay: number) {
  const hero = root.querySelector<HTMLElement>(".hero");
  if (!hero) return;
  const media = hero.querySelector(".hero-media");
  const bottom = hero.querySelector(".hero-bottom");
  const selectors = all(hero, ".hero-selector, .hero-pause");
  const title = hero.querySelector<HTMLElement>(".hero-title");
  if (!media || !bottom) return;

  const tl = gsap.timeline({ delay });
  tl.fromTo(media, { clipPath: "inset(14% 9% 14% 9%)", scale: 1.25, autoAlpha: 1 }, { clipPath: "inset(0% 0% 0% 0%)", scale: 1, duration: 1.8, ease: "expo.inOut", clearProps: "clipPath" })
    .set(bottom, { visibility: "inherit" }, 0.6)
    .fromTo(selectors, { yPercent: 60, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 1.1, ease: "expo.out", stagger: 0.09, clearProps: "opacity,visibility" }, 0.9);
  if (title) {
    const split = SplitText.create(title, { type: "lines", mask: "lines", aria: "auto" });
    tl.from(split.lines, { yPercent: 110, duration: 1.2, ease: "expo.out", stagger: 0.08 }, 1.05);
  }

  // Scroll out: the image sinks, the story selectors lift away.
  gsap.timeline({ scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true } })
    .to(media, { yPercent: 18, ease: "none" }, 0)
    .to(bottom, { y: -80, opacity: 0, ease: "none", duration: 0.6 }, 0);
}

function continuumScene(root: ParentNode, mm: gsap.MatchMedia) {
  const section = root.querySelector<HTMLElement>(".home-continuum");
  if (!section) return;
  const heading = section.querySelector<HTMLElement>("h2");
  const frames = all(section, ".home-continuum-item");
  const count = section.querySelector(".home-continuum-count-n");
  const fill = section.querySelector(".home-continuum-track span");
  const labels = all(section, ".home-continuum-steps li");
  if (!heading || frames.length !== 4) return;
  const words = SplitText.create(heading, { type: "words", aria: "auto" }).words;

  mm.add(DESKTOP_STAGE, () => {
    section.classList.add("is-staged");
    const imgs = frames.map((frame) => frame.querySelector("img"));
    const enter: RevealDir[] = ["up", "left", "up", "right"];
    frames.slice(1).forEach((frame, i) => gsap.set(frame, { clipPath: CLIP[enter[i + 1]] }));
    gsap.set(words, { opacity: 0.14 });
    let current = -1;
    const setBeat = (index: number) => {
      if (index === current) return;
      current = index;
      if (count) count.textContent = `0${index + 1}`;
      labels.forEach((label, i) => label.toggleAttribute("data-active", i === index));
    };
    setBeat(0);

    const BEATS = [0, 1, 2].map((i) => 0.6 + i * 1.15 + 0.45);
    const tl: gsap.core.Timeline = gsap.timeline({
      defaults: { ease: "none" },
      // A beat changes once its frame's wipe is half way up (follows the scrubbed time, not raw scroll).
      onUpdate: () => setBeat(BEATS.filter((t) => tl.time() >= t).length),
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=320%",
        pin: true,
        scrub: 0.8,
      },
    });
    tl.to(words, { opacity: 1, stagger: 0.08, duration: 0.4 }, 0);
    if (fill) tl.fromTo(fill, { scaleX: 0 }, { scaleX: 1, duration: 4 }, 0);
    frames.slice(1).forEach((frame, i) => {
      const at = 0.6 + i * 1.15;
      tl.to(frame, { clipPath: OPEN, duration: 0.9, ease: "power2.inOut" }, at)
        .fromTo(imgs[i + 1], { scale: 1.3 }, { scale: 1, duration: 1.2 }, at)
        .to(imgs[i], { scale: 1.08, yPercent: -6, duration: 0.9 }, at);
    });
    tl.to({}, { duration: 0.4 });
    return () => section.classList.remove("is-staged");
  });

  mm.add(`not all and ${DESKTOP_STAGE}`, () => {
    gsap.fromTo(words, { opacity: 0.14 }, { opacity: 1, stagger: 0.05, ease: "none", scrollTrigger: { trigger: heading, start: "top 85%", end: "bottom 45%", scrub: true } });
    const grid: RevealDir[] = ["up", "left", "down", "right"];
    frames.forEach((frame, i) => {
      const img = frame.querySelector("img");
      gsap.timeline({ scrollTrigger: once(frame, "top 92%") })
        .fromTo(frame, { clipPath: CLIP[grid[i]] }, { clipPath: OPEN, duration: 1.35, ease: "expo.inOut", delay: (i % 2) * 0.12, clearProps: "clipPath" })
        .from(img, { scale: 1.22, ...settleFrom(grid[i]), duration: 1.8, ease: "expo.out" }, 0);
    });
  });
}

function materialScene(root: ParentNode) {
  const stage = root.querySelector<HTMLElement>(".home-material-stage");
  if (!stage) return;
  const bags = all(stage, ".home-material-bag");
  gsap.timeline({ scrollTrigger: { trigger: stage, start: "top bottom", end: "top 25%", scrub: 0.8 } })
    .fromTo(stage, { clipPath: "inset(16% 12% 0% 12%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "none" }, 0)
    .fromTo(bags, { yPercent: (i) => (i === 1 ? 70 : 42) }, { yPercent: 0, ease: "none", stagger: 0.06 }, 0);
  // The exit drift lives on an inner wrapper so the two scrubbed tweens never share a property.
  gsap.fromTo(all(stage, ".home-material-bag-drift"), { y: 0 }, { y: (i) => (i === 1 ? -72 : -24), ease: "none", scrollTrigger: { trigger: stage, start: "top 25%", end: "bottom top", scrub: true } });
}

function editionScene(root: ParentNode) {
  const panel = root.querySelector<HTMLElement>(".home-edition-panel");
  if (!panel) return;
  const img = panel.querySelector("img");
  gsap.timeline({ scrollTrigger: { trigger: panel, start: "top bottom", end: "top 12%", scrub: 0.8 } })
    .fromTo(panel, { clipPath: "inset(10% 14% 10% 14%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "none" }, 0)
    .fromTo(img, { scale: 1.35 }, { scale: 1, ease: "none" }, 0);
}

function kilnScene(root: ParentNode) {
  const object = root.querySelector<HTMLElement>(".home-kiln-object");
  const light = object?.querySelector(".home-kiln-light");
  if (!object || !light) return;
  gsap.fromTo(light, { xPercent: -130 }, { xPercent: 130, ease: "none", scrollTrigger: { trigger: object, start: "top 85%", end: "bottom 15%", scrub: true } });
}

function folioScene(root: ParentNode, mm: gsap.MatchMedia) {
  const chapters = all(root, ".folio-chapter");
  if (!chapters.length) return;
  const links = all<HTMLAnchorElement>(root, ".folio-bar-inner a, .folio-toc a");
  const progress = root.querySelector(".folio-bar-progress");

  if (progress) {
    gsap.fromTo(progress, { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: chapters[0], endTrigger: chapters[chapters.length - 1], start: "top 50%", end: "bottom bottom", scrub: true } });
  }
  chapters.forEach((chapter) => {
    ScrollTrigger.create({
      trigger: chapter,
      start: "top 50%",
      end: "bottom 50%",
      onToggle: (self) => {
        if (!self.isActive) return;
        for (const link of links) {
          if (link.hash === `#${chapter.id}`) link.setAttribute("aria-current", "step");
          else link.removeAttribute("aria-current");
        }
      },
    });
    const number = chapter.querySelector<HTMLElement>(".folio-number");
    if (number) {
      const chars = SplitText.create(number, { type: "chars", mask: "chars", aria: "none" }).chars;
      gsap.from(chars, { yPercent: 105, duration: 1.3, ease: "expo.out", stagger: 0.08, scrollTrigger: once(number) });
    }
  });

  const plateDir: RevealDir[] = ["up", "down", "right"];
  mm.add("(min-width: 901px)", () => {
    for (const [index, chapter] of chapters.entries()) {
      const media = chapter.querySelector<HTMLElement>(".folio-plate-media");
      const img = media?.querySelector("img");
      if (!media || !img) continue;
      gsap.timeline({ scrollTrigger: { trigger: chapter, start: "top 85%", end: "top 25%", scrub: 0.6 } })
        .fromTo(media, { clipPath: CLIP[plateDir[index % 3]] }, { clipPath: OPEN, ease: "none" });
      gsap.fromTo(img, { scale: 1.25, yPercent: -4 }, { scale: 1, yPercent: 4, ease: "none", scrollTrigger: { trigger: chapter, start: "top bottom", end: "bottom top", scrub: true } });
    }
  });
  mm.add("(max-width: 900px)", () => {
    for (const [index, chapter] of chapters.entries()) {
      const media = chapter.querySelector<HTMLElement>(".folio-plate-media");
      const img = media?.querySelector("img");
      if (!media || !img) continue;
      gsap.timeline({ scrollTrigger: once(media, "top 92%") })
        .fromTo(media, { clipPath: CLIP[plateDir[index % 3]] }, { clipPath: OPEN, duration: 1.35, ease: "expo.inOut", clearProps: "clipPath" })
        .from(img, { scale: 1.22, ...settleFrom(plateDir[index % 3]), duration: 1.8, ease: "expo.out" }, 0);
    }
  });
}

/** Hover zoom for GSAP-driven images (CSS transitions would fight the scroll tweens). */
function hoverZoom(root: ParentNode) {
  const cleanups: Array<() => void> = [];
  if (!matchMedia("(hover: hover)").matches) return cleanups;
  for (const link of all(root, ".home-origin, .editions-featured, .editions-story")) {
    const img = link.querySelector<HTMLElement>("img");
    if (!img) continue;
    const base = () => Number(img.dataset.baseScale ?? 1);
    const enter = () => gsap.to(img, { scale: base() * 1.035, duration: 1.2, ease: "expo.out", overwrite: "auto" });
    const leave = () => gsap.to(img, { scale: base(), duration: 1, ease: "expo.out", overwrite: "auto" });
    link.addEventListener("pointerenter", enter);
    link.addEventListener("pointerleave", leave);
    cleanups.push(() => { link.removeEventListener("pointerenter", enter); link.removeEventListener("pointerleave", leave); });
  }
  return cleanups;
}

function productScene(root: ParentNode) {
  const gallery = root.querySelector<HTMLElement>(".gallery");
  if (!gallery) return;
  gsap.fromTo(gallery.querySelector(".gallery-main"), { y: 50, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.3, ease: "expo.out", delay: 0.15 });
  gsap.fromTo(all(gallery, ".gallery-thumb"), { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, ease: "expo.out", stagger: 0.06, delay: 0.35, clearProps: "opacity,visibility" });
}

function articleScene(root: ParentNode) {
  const body = root.querySelector(".article-body");
  const bar = root.querySelector(".read-progress span");
  if (!body || !bar) return;
  gsap.fromTo(bar, { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: body, start: "top 70%", end: "bottom bottom", scrub: true } });
}

function footerScene() {
  const footer = document.querySelector<HTMLElement>(".site-footer");
  const svg = footer?.querySelector(".site-footer-mark svg");
  if (!footer || !svg) return;
  gsap.fromTo(svg, { yPercent: 75 }, { yPercent: 0, ease: "none", scrollTrigger: { trigger: footer, start: "top bottom", end: "bottom bottom", scrub: true } });
}

/** Builds every scene for the current route. Call inside a gsap.context(). */
export function buildScenes(root: HTMLElement, { heroDelay = 0 } = {}) {
  const mm = gsap.matchMedia();
  const taken = new Set<Element>([...all(root, MOTION.lines), ...all(root, MOTION.mask), ...all(root, MOTION.cards), ...all(root, MOTION.rule)]);

  heroScene(root, heroDelay);
  continuumScene(root, mm);
  materialScene(root);
  editionScene(root);
  kilnScene(root);
  folioScene(root, mm);
  productScene(root);
  articleScene(root);
  footerScene();

  revealLines(document);
  revealMasks(root);
  revealCards(root);
  revealRules(root);
  revealFades(document, taken);
  const cleanups = hoverZoom(root);
  return () => cleanups.forEach((cleanup) => cleanup());
}

export { gsap, ScrollTrigger, SplitText };
