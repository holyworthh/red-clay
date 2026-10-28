"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { type HeroTone, homeHeroToneEvent } from "@/content/homeHero";
import { navigation } from "@/content/navigation";
import { redClayAssets } from "@/lib/assets/registry";
import { useBag } from "@/components/commerce/BagProvider";

type Panel = "shop" | "origins" | null;

const CLOSE_DELAY = 180;

export function Header() {
  const pathname = usePathname();
  const { count, open: openBag } = useBag();
  const [panel, setPanel] = useState<Panel>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [heroTone, setHeroTone] = useState<HeroTone>("light");
  const closeTimer = useRef<number | null>(null);
  const isHome = pathname === "/";

  const cancelClose = useCallback(() => {
    if (closeTimer.current != null) window.clearTimeout(closeTimer.current);
    closeTimer.current = null;
  }, []);
  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setPanel(null), CLOSE_DELAY);
  }, [cancelClose]);
  const openPanel = useCallback((next: Exclude<Panel, null>) => {
    cancelClose();
    setPanel(next);
  }, [cancelClose]);

  useEffect(() => {
    setPanel(null);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => () => cancelClose(), [cancelClose]);

  useEffect(() => {
    if (!isHome) return;
    const onTone = (event: Event) => {
      const tone = (event as CustomEvent<HeroTone>).detail;
      if (tone === "light" || tone === "dark") setHeroTone(tone);
    };
    const initial = document.documentElement.dataset.homeHeroTone;
    if (initial === "light" || initial === "dark") setHeroTone(initial);
    document.addEventListener(homeHeroToneEvent, onTone);
    return () => document.removeEventListener(homeHeroToneEvent, onTone);
  }, [isHome]);

  useEffect(() => {
    if (!panel) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setPanel(null);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [panel]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);
  const isCurrent = (href: string) => pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
  const overlay = isHome && !panel;
  const tone = overlay ? heroTone : "solid";

  return (
    <header className={`site-header ${isHome ? "site-header--home" : ""}`} data-tone={tone} data-panel={panel ?? "none"} onMouseLeave={scheduleClose} onMouseEnter={cancelClose}>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <div className="site-header-bar">
        <div className="site-header-left">
          <nav className="site-nav" aria-label="Primary">
            {navigation.primary.map((item) => {
              const key = item.href === "/shop" ? "shop" : item.href === "/origins" ? "origins" : null;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`site-nav-link ${isCurrent(item.href) || (key !== null && panel === key) ? "is-current" : ""}`}
                  onMouseEnter={() => (key ? openPanel(key) : setPanel(null))}
                  onFocus={() => setPanel(null)}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <button className="site-menu-button" type="button" aria-label="Open menu" aria-expanded={mobileOpen} aria-controls="mobile-menu" onClick={() => setMobileOpen(true)}>
            <svg width="22" height="12" viewBox="0 0 22 12" aria-hidden="true"><path d="M0 1h22M0 11h22" stroke="currentColor" strokeWidth="1.2" /></svg>
          </button>
        </div>
        <Link className="site-wordmark" href="/" aria-label="Red Clay, home">Red Clay</Link>
        <div className="site-header-right">
          <button className="site-nav-link site-bag" type="button" aria-label={`Bag, ${count} ${count === 1 ? "item" : "items"}`} onClick={(event) => openBag(event.currentTarget)}>Bag ({count})</button>
        </div>
      </div>
      {panel === "shop" && <ShopPanel key="shop" onNavigate={() => setPanel(null)} />}
      {panel === "origins" && <OriginsPanel key="origins" onNavigate={() => setPanel(null)} />}
      {mobileOpen && <MobileMenu count={count} close={closeMobile} openBag={openBag} />}
    </header>
  );
}

function ShopPanel({ onNavigate }: Readonly<{ onNavigate: () => void }>) {
  let row = 0;
  const delay = () => ({ animationDelay: `${(row++) * 0.055}s` });
  return (
    <div className="mega">
      <div className="mega-grid">
        <div className="mega-col mega-col--primary">
          <span className="mono mega-label cascade" style={delay()}>Coffee</span>
          {navigation.shopMenu.coffee.map((item) => <Link key={item.href} href={item.href} className="mega-primary-link cascade" style={delay()} onClick={onNavigate}>{item.label}</Link>)}
        </div>
        <div className="mega-col">
          <span className="mono mega-label cascade" style={delay()}>Current Harvest</span>
          {navigation.shopMenu.harvest.map((item) => <Link key={item.href} href={item.href} className="mega-link cascade" style={delay()} onClick={onNavigate}>{item.label} <span>— {item.meta}</span></Link>)}
          <span className="mono mega-label mega-label--gap cascade" style={delay()}>Object</span>
          {navigation.shopMenu.object.map((item) => <Link key={item.href} href={item.href} className="mega-link cascade" style={delay()} onClick={onNavigate}>{item.label}</Link>)}
        </div>
        <Link href="/shop#material-series" className="mega-feature cascade-feature" onClick={onNavigate}>
          <span className="mega-feature-media mega-feature-media--bags">
            {[redClayAssets.products.materialLaterite, redClayAssets.products.materialBasalt, redClayAssets.products.materialLinen].map((asset) => <Image key={asset.id} className="cut" src={asset.src} alt={asset.alt} width={444} height={680} sizes="12vw" />)}
          </span>
          <span className="mega-feature-caption"><span className="serif">The Material Series — Laterite, Basalt, Linen</span><span className="mono">House coffees</span></span>
        </Link>
      </div>
    </div>
  );
}

function OriginsPanel({ onNavigate }: Readonly<{ onNavigate: () => void }>) {
  const [active, setActive] = useState(0);
  const items = navigation.originMenu;
  return (
    <div className="mega">
      <div className="mega-grid mega-grid--origins">
        <div className="mega-col mega-col--list">
          <span className="mono mega-label cascade">Origins</span>
          {items.map((item, index) => (
            <Link key={item.href} href={item.href} className="mega-region cascade" style={{ animationDelay: `${(index + 1) * 0.055}s` }} onMouseEnter={() => setActive(index)} onFocus={() => setActive(index)} onClick={onNavigate}>
              <span className="serif">{item.label}</span><span className="mono">{item.meta}</span>
            </Link>
          ))}
        </div>
        <div className="mega-feature cascade-feature">
          <span className="mega-feature-media">
            {items.map((item, index) => <Image key={item.href} className="grade mega-region-image" data-active={index === active} src={item.image.src} alt={index === active ? item.image.alt : ""} fill sizes="45vw" />)}
          </span>
          <span className="mega-feature-caption"><span className="serif">{items[active].label}</span><span className="mono">{items[active].caption}</span></span>
        </div>
      </div>
    </div>
  );
}

function MobileMenu({ count, close, openBag }: Readonly<{ count: number; close: () => void; openBag: (trigger?: HTMLElement | null) => void }>) {
  const [section, setSection] = useState<"shop" | "origins" | null>("shop");
  const ref = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    lastFocus.current = document.activeElement as HTMLElement;
    document.body.classList.add("menu-open");
    ref.current?.querySelector<HTMLElement>("button, a")?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key !== "Tab" || !ref.current) return;
      const focusable = Array.from(ref.current.querySelectorAll<HTMLElement>("a[href], button"));
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.classList.remove("menu-open");
      document.removeEventListener("keydown", onKey);
      lastFocus.current?.focus();
    };
  }, [close]);

  const toggle = (next: "shop" | "origins") => setSection((current) => (current === next ? null : next));

  return (
    <div ref={ref} className="mobile-menu" id="mobile-menu" role="dialog" aria-modal="true" aria-label="Menu">
      <div className="mobile-menu-bar">
        <button className="mobile-menu-close" type="button" aria-label="Close menu" onClick={close}><svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.3" /></svg></button>
        <Link className="site-wordmark" href="/" onClick={close}>Red Clay</Link>
        <button className="site-nav-link" type="button" onClick={() => { close(); openBag(document.querySelector<HTMLElement>(".site-menu-button")); }}>Bag ({count})</button>
      </div>
      <nav className="mobile-menu-nav" aria-label="Menu">
        <button className="mobile-menu-top" type="button" aria-expanded={section === "shop"} onClick={() => toggle("shop")}><span className="serif">Shop</span><span aria-hidden="true">{section === "shop" ? "−" : "+"}</span></button>
        {section === "shop" && <div className="mobile-menu-sub">
          {navigation.shopMenu.coffee.map((item) => <Link key={item.href} href={item.href} onClick={close}>{item.label}</Link>)}
          {navigation.shopMenu.object.map((item) => <Link key={item.href} href={item.href} onClick={close}>{item.label}</Link>)}
          <span className="mobile-menu-bags">
            {[redClayAssets.products.materialLaterite, redClayAssets.products.materialBasalt, redClayAssets.products.materialLinen].map((asset) => <Image key={asset.id} className="cut" src={asset.src} alt={asset.alt} width={444} height={680} sizes="28vw" />)}
          </span>
        </div>}
        <button className="mobile-menu-top" type="button" aria-expanded={section === "origins"} onClick={() => toggle("origins")}><span className="serif">Origins</span><span aria-hidden="true">{section === "origins" ? "−" : "+"}</span></button>
        {section === "origins" && <div className="mobile-menu-sub">
          {navigation.originMenu.map((item) => <Link key={item.href} href={item.href} onClick={close}>{item.label}<span className="mono">{item.meta}</span></Link>)}
        </div>}
        <Link className="mobile-menu-top" href="/journal" onClick={close}><span className="serif">Editions</span></Link>
        <Link className="mobile-menu-top" href="/about" onClick={close}><span className="serif">About</span></Link>
      </nav>
      <div className="mobile-menu-foot">
        <Link href="/checkout" onClick={close}>Checkout</Link>
        <p className="mono">Roasted in Nairobi · Coffee, held by place</p>
      </div>
    </div>
  );
}
