"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/**
 * A clay disc that follows fine pointers over `[data-cursor]` targets and names the
 * action (View, Read, Explore). Decorative: the native cursor and link text remain.
 */
export function CursorLabel() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const disc = ref.current;
    if (!disc || !document.documentElement.classList.contains("js-motion") || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const label = disc.querySelector("span")!;
    const x = gsap.quickTo(disc, "x", { duration: 0.45, ease: "power3.out" });
    const y = gsap.quickTo(disc, "y", { duration: 0.45, ease: "power3.out" });
    let active: Element | null = null;

    const onMove = (event: PointerEvent) => {
      x(event.clientX);
      y(event.clientY);
      const target = (event.target as Element | null)?.closest?.("[data-cursor]") ?? null;
      if (target === active) return;
      active = target;
      if (target) {
        label.textContent = target.getAttribute("data-cursor");
        gsap.to(disc, { scale: 1, autoAlpha: 1, duration: 0.45, ease: "expo.out" });
      } else {
        gsap.to(disc, { scale: 0, autoAlpha: 0, duration: 0.35, ease: "power3.out" });
      }
    };
    const onLeave = () => { active = null; gsap.to(disc, { scale: 0, autoAlpha: 0, duration: 0.3 }); };
    gsap.set(disc, { xPercent: -50, yPercent: -50, scale: 0, autoAlpha: 0 });
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => { window.removeEventListener("pointermove", onMove); document.removeEventListener("pointerleave", onLeave); };
  }, []);

  return <div ref={ref} className="cursor-label" aria-hidden="true"><span className="mono" /></div>;
}
