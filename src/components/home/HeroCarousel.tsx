"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { homeHeroSlides, homeHeroToneEvent } from "@/content/homeHero";

export function HeroCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [stopped, setStopped] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const slide = homeHeroSlides[active];

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (paused || stopped || reducedMotion) return;
    const timer = window.setInterval(() => setActive((index) => (index + 1) % homeHeroSlides.length), 5000);
    return () => window.clearInterval(timer);
  }, [active, paused, stopped, reducedMotion]);

  useEffect(() => {
    document.documentElement.dataset.homeHeroTone = slide.headerTone;
    document.dispatchEvent(new CustomEvent(homeHeroToneEvent, { detail: slide.headerTone }));
    return () => { delete document.documentElement.dataset.homeHeroTone; };
  }, [slide.headerTone]);

  return (
    <section
      className="hero"
      aria-labelledby="home-title"
      onPointerEnter={(event) => { if (event.pointerType === "mouse") setPaused(true); }}
      onPointerLeave={(event) => { if (event.pointerType === "mouse") setPaused(false); }}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPaused(false); }}
    >
      <div className="hero-media">
        {homeHeroSlides.map((item, index) => (
          <div key={item.id} className="hero-slide" data-active={index === active} aria-hidden={index !== active}>
            <Image className="grade" src={item.image} alt={index === active ? item.alt : ""} fill priority={index === 0} sizes="100vw" style={{ objectPosition: item.objectPosition }} />
          </div>
        ))}
        <div className="hero-scrim" aria-hidden="true" />
      </div>
      <div className="wrap hero-bottom">
        <div className="hero-selectors" role="group" aria-label="Choose a hero story">
          {homeHeroSlides.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className="hero-selector"
              aria-pressed={index === active}
              onClick={() => setActive(index)}
              onFocus={() => setActive(index)}
              onPointerEnter={(event) => { if (event.pointerType === "mouse") setActive(index); }}
            >
              <span className="mono">0{index + 1}</span>
              <span className="serif hero-selector-label">{item.label}</span>
              <span className="mono hero-selector-caption">{item.caption}</span>
            </button>
          ))}
          {!reducedMotion && <button type="button" className="mono hero-pause" aria-pressed={stopped} onClick={() => setStopped((value) => !value)}>{stopped ? "Play" : "Pause"}</button>}
        </div>
        <h1 id="home-title" className="serif hero-title">Coffee, held by place.</h1>
      </div>
    </section>
  );
}
