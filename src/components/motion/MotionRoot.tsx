"use client";

import Lenis from "lenis";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { buildScenes, gsap, ScrollTrigger, SplitText } from "@/lib/motion/scenes";

declare global {
  interface Window { __rcMotion?: boolean; __rcLenis?: Lenis }
}

const HEADER_OFFSET = -72;
const reduced = () => !document.documentElement.classList.contains("js-motion");

/** Link text worth showing on the transition plane. */
function labelFor(link: HTMLAnchorElement) {
  const text = (link.dataset.transitionLabel ?? link.querySelector(".serif, .product-card-name")?.textContent ?? link.getAttribute("aria-label") ?? link.textContent ?? "").replace(/\s+/g, " ").trim();
  return text && text.length <= 36 ? text : "Red Clay";
}

/**
 * The motion runtime: smooth scroll, per-route scenes, the first-visit intro and the
 * clay page transition. Everything here is enhancement; see 09_MOTION_INTERACTION_SYSTEM.md.
 */
export function MotionRoot() {
  const pathname = usePathname();
  const router = useRouter();
  const covered = useRef(false);
  const introDelay = useRef(0);

  // Smooth scroll, intro, link interception, overlays. Once per app session.
  useEffect(() => {
    if (reduced()) return;
    const root = document.documentElement;
    const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 0.9, autoRaf: false });
    window.__rcLenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Page scroll pauses while the bag or the mobile menu is open.
    const lock = new MutationObserver(() => {
      const locked = document.body.classList.contains("bag-open") || document.body.classList.contains("menu-open");
      if (locked) lenis.stop(); else lenis.start();
    });
    lock.observe(document.body, { attributes: true, attributeFilter: ["class"] });

    // First visit: the wordmark rises, the field lifts into the hero.
    const intro = document.querySelector<HTMLElement>(".intro");
    if (intro && root.classList.contains("rc-intro")) {
      introDelay.current = 1.5;
      lenis.stop();
      const word = SplitText.create(intro.querySelector(".intro-word"), { type: "chars", mask: "chars", aria: "none" });
      gsap.timeline({ onComplete: () => { root.classList.remove("rc-intro"); word.revert(); lenis.start(); } })
        .from(word.chars, { yPercent: 110, duration: 1, ease: "expo.out", stagger: 0.045 }, 0.1)
        .from(".intro-line", { scaleX: 0, duration: 1, ease: "expo.inOut" }, 0.3)
        .from(".intro-sub", { autoAlpha: 0, y: 12, duration: 0.7, ease: "power3.out" }, 0.75)
        .to(intro, { clipPath: "inset(0% 0% 100% 0%)", duration: 1.1, ease: "expo.inOut" }, 1.45);
    }

    // Internal links: cover with the clay plane, navigate underneath.
    const curtain = document.querySelector<HTMLElement>(".curtain");
    const label = curtain?.querySelector<HTMLElement>(".curtain-label");
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element | null)?.closest?.("a");
      if (!link || !link.href || link.hasAttribute("download") || (link.target && link.target !== "_self")) return;
      const url = new URL(link.href, location.href);
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname) {
        if (!url.hash || url.search !== location.search) return;
        event.preventDefault();
        lenis.scrollTo(url.hash, { offset: HEADER_OFFSET });
        history.replaceState(history.state, "", url.hash);
        return;
      }
      if (!curtain || !label || covered.current) return;
      event.preventDefault();
      covered.current = true;
      label.textContent = labelFor(link);
      lenis.stop();
      // Navigation never waits on animation frames (they pause in background tabs).
      let gone = false;
      const go = () => { if (!gone) { gone = true; router.push(url.pathname + url.search + url.hash); } };
      window.setTimeout(go, 900);
      gsap.timeline({ onComplete: go })
        .set(curtain, { visibility: "visible", clipPath: "inset(100% 0% 0% 0%)" })
        .to(curtain, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.75, ease: "expo.inOut" })
        .fromTo(label, { yPercent: 110 }, { yPercent: 0, duration: 0.8, ease: "expo.out" }, 0.3);
      // Never trap anyone behind the plane.
      window.setTimeout(() => { if (covered.current) uncover(); }, 6000);
    };
    window.addEventListener("click", onClick, true);

    window.__rcMotion = true;
    return () => {
      window.removeEventListener("click", onClick, true);
      lock.disconnect();
      gsap.ticker.remove(raf);
      lenis.destroy();
      delete window.__rcLenis;
    };
  }, [router]);

  // Every route: reset scroll, build scenes, lift the plane.
  useEffect(() => {
    if (reduced()) { window.__rcMotion = true; return; }
    const lenis = window.__rcLenis;
    const target = location.hash ? document.querySelector(location.hash) : null;
    lenis?.scrollTo(target instanceof HTMLElement ? target : 0, { immediate: true, force: true, offset: target ? HEADER_OFFSET : 0 });

    const main = document.querySelector<HTMLElement>("main");
    let ctx: gsap.Context | undefined;
    let cancelled = false;
    const wasCovered = covered.current;
    document.fonts.ready.then(() => {
      if (cancelled || !main) return;
      ctx = gsap.context(() => {
        const cleanup = buildScenes(main, { heroDelay: introDelay.current || (wasCovered ? 0.45 : 0.1) });
        // Measured positions are off by the entrance offset until it settles, so refresh after.
        if (wasCovered) gsap.from(main, { y: 60, duration: 1.2, ease: "expo.out", clearProps: "transform", onComplete: () => ScrollTrigger.refresh() });
        return cleanup;
      });
      introDelay.current = 0;
      ScrollTrigger.refresh();
      if (wasCovered) uncover();
    });

    return () => { cancelled = true; ctx?.revert(); };
  }, [pathname]);

  function uncover() {
    const curtain = document.querySelector<HTMLElement>(".curtain");
    covered.current = false;
    window.__rcLenis?.start();
    if (!curtain) return;
    gsap.timeline()
      .to(curtain, { clipPath: "inset(0% 0% 100% 0%)", duration: 0.9, ease: "expo.inOut" })
      .set(curtain, { visibility: "hidden" });
  }

  // Magnetic primary buttons (fine pointers only).
  useEffect(() => {
    if (reduced() || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const onMove = (event: PointerEvent) => {
      const button = (event.target as Element | null)?.closest?.<HTMLElement>(".button");
      document.querySelectorAll<HTMLElement>(".button[data-magnet]").forEach((el) => {
        if (el === button) return;
        el.removeAttribute("data-magnet");
        gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: "expo.out" });
      });
      if (!button) return;
      const box = button.getBoundingClientRect();
      button.setAttribute("data-magnet", "");
      gsap.to(button, { x: (event.clientX - box.left - box.width / 2) * 0.25, y: (event.clientY - box.top - box.height / 2) * 0.35, duration: 0.5, ease: "power3.out" });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return null;
}
