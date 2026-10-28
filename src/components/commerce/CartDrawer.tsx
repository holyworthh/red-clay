"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { getBagLineKey, useBag, type BagItem } from "@/components/commerce/BagProvider";
import { ProductVisual } from "@/components/product/ProductVisual";
import { formatKes, formatLabel, getProductById, getProductBySlug } from "@/content/coffees";

const FREE_DELIVERY = 5000;
const itemPrice = (item: BagItem) => item.price ?? getProductById(item.id)?.price ?? null;

export function CartDrawer() {
  const { isOpen, close, count } = useBag();
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    document.body.classList.add("bag-open");
    const panel = panelRef.current;
    const focusable = () => Array.from(panel?.querySelectorAll<HTMLElement>("button, a[href], input") ?? []).filter((element) => !element.hasAttribute("disabled"));
    window.setTimeout(() => focusable()[0]?.focus(), 0);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); close(); return; }
      if (event.key !== "Tab") return;
      const elements = focusable();
      if (elements.length === 0) return;
      if (event.shiftKey && document.activeElement === elements[0]) { event.preventDefault(); elements[elements.length - 1].focus(); }
      else if (!event.shiftKey && document.activeElement === elements[elements.length - 1]) { event.preventDefault(); elements[0].focus(); }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.classList.remove("bag-open");
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, close]);

  if (!isOpen) return null;
  return (
    <>
      <button className="drawer-backdrop" type="button" aria-label="Close bag" onClick={close} />
      <aside ref={panelRef} className="drawer" role="dialog" aria-modal="true" aria-labelledby="bag-title">
        <div className="drawer-head">
          <h2 id="bag-title" className="serif">Your Bag <span className="mono muted">({count})</span></h2>
          <button className="icon-button" type="button" aria-label="Close bag" onClick={close}><svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.3" /></svg></button>
        </div>
        <BagContents compact />
      </aside>
    </>
  );
}

export function BagContents({ compact = false }: Readonly<{ compact?: boolean }>) {
  const { items, announcement, increment, decrement, remove, undoRemove, canUndo, close } = useBag();
  const subtotal = items.reduce((total, item) => total + (itemPrice(item) ?? 0) * item.quantity, 0);
  const away = FREE_DELIVERY - subtotal;
  const suggestions = [getProductBySlug("laterite"), getProductBySlug("three-regions")].filter((product) => product !== undefined);

  return (
    <div className={`bag ${compact ? "bag--drawer" : "bag--page"}`}>
      <p className="sr-only" aria-live="polite">{announcement}</p>
      {items.length === 0 ? (
        <div className="bag-empty">
          <p className="serif display-s">Your Bag is empty.</p>
          <p>Start with a house coffee, or taste three regions side by side.</p>
          <div className="grid-2">
            {suggestions.map((product) => (
              <Link key={product.slug} href={`/shop/${product.slug}`} className="bag-suggestion" onClick={compact ? close : undefined}>
                <span className="ratio-4-5"><ProductVisual product={product} sizes="160px" /></span>
                <span className="serif">{product.name}</span>
                <span className="mono muted">{product.formatPrices ? `From ${formatKes(Math.min(...Object.values(product.formatPrices)))}` : formatKes(product.price)}</span>
              </Link>
            ))}
          </div>
          <Link className="button button--outline" href="/shop" onClick={compact ? close : undefined}>Continue shopping</Link>
        </div>
      ) : (
        <>
          <div className="bag-progress">
            <p>{away > 0 ? `${formatKes(away)} away from free Kenya delivery.` : "Free Kenya delivery is on this order."}</p>
            <div role="progressbar" aria-label="Progress to free Kenya delivery" aria-valuemin={0} aria-valuemax={FREE_DELIVERY} aria-valuenow={Math.min(subtotal, FREE_DELIVERY)} className="bag-progress-track"><span style={{ width: `${Math.min(100, (subtotal / FREE_DELIVERY) * 100)}%` }} /></div>
          </div>
          <ul className="bag-lines">
            {items.map((item) => {
              const product = getProductById(item.id);
              const lineKey = getBagLineKey(item);
              const price = itemPrice(item);
              const name = product?.name ?? item.id;
              return (
                <li key={lineKey} className="bag-line">
                  <Link className="bag-line-media ratio-4-5" href={`/shop/${item.slug}`} aria-label={`View ${name}`} onClick={compact ? close : undefined}>{product && <ProductVisual product={product} sizes="88px" scale="thumb" />}</Link>
                  <div className="bag-line-copy">
                    <span className="serif bag-line-name">{name}</span>
                    <span className="mono muted">{[product?.family === "current-harvest" ? product.region : product?.role, formatLabel(item.format), item.grind].filter(Boolean).join(" · ")}</span>
                    <div className="bag-line-controls">
                      <div className="qty qty--small" role="group" aria-label={`Quantity for ${name}`}>
                        <button type="button" aria-label={`Decrease ${name}`} onClick={() => decrement(lineKey)}>−</button>
                        <span>{item.quantity}</span>
                        <button type="button" aria-label={`Increase ${name}`} onClick={() => increment(lineKey)}>+</button>
                      </div>
                      <button className="link-button" type="button" onClick={() => remove(lineKey)}>Remove</button>
                    </div>
                  </div>
                  <span className="bag-line-price">{formatKes(price == null ? null : price * item.quantity)}</span>
                </li>
              );
            })}
          </ul>
          <div className="bag-summary">
            <div className="bag-summary-row"><span>Subtotal</span><span>{formatKes(subtotal)}</span></div>
            <p className="small muted">Delivery is calculated at checkout. Nairobi KES 300, rest of Kenya KES 500.</p>
            <Link className="button button--block" href="/checkout" onClick={compact ? close : undefined}>Checkout</Link>
            <p className="mono muted bag-demo">Portfolio demo checkout — no payment is collected and no order is fulfilled.</p>
          </div>
        </>
      )}
      {canUndo && <button className="link-button bag-undo" type="button" onClick={undoRemove}>Undo removal</button>}
    </div>
  );
}
