"use client";

import { useEffect, useRef, useState } from "react";
import { formatKes, formatLabel, getProductVariantPrice, type Product } from "@/content/coffees";
import { useBag } from "@/components/commerce/BagProvider";

export function BuyBox({ product }: Readonly<{ product: Product }>) {
  const { add } = useBag();
  const [format, setFormat] = useState(product.formats[0]);
  const [grind, setGrind] = useState(product.grinds?.[0]);
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState("");
  const [barVisible, setBarVisible] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const price = getProductVariantPrice(product, { format });
  const hasFormats = product.formats.length > 1;
  const hasGrinds = (product.grinds?.length ?? 0) > 1;

  useEffect(() => {
    const target = boxRef.current?.querySelector(".buy-add");
    if (!target) return;
    const observer = new IntersectionObserver(([entry]) => setBarVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0), { threshold: 0 });
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  function addToBag(trigger: HTMLElement) {
    add(product, quantity, trigger, { format, grind });
    setStatus(`${quantity} × ${product.name}${hasFormats ? ` (${formatLabel(format)})` : ""} added to your Bag.`);
  }

  return (
    <div className="buy" ref={boxRef}>
      {hasFormats && (
        <div className="buy-options" role="group" aria-label="Size">
          {product.formats.map((option) => <button key={option} type="button" className="option" aria-pressed={option === format} onClick={() => setFormat(option)}>{formatLabel(option)}</button>)}
        </div>
      )}
      {hasGrinds && (
        <label className="buy-grind">
          <span className="mono muted">Grind</span>
          <select value={grind} onChange={(event) => setGrind(event.target.value)}>{product.grinds!.map((option) => <option key={option}>{option}</option>)}</select>
        </label>
      )}
      <p className="buy-price">{formatKes(price)}</p>
      <div className="buy-row">
        <div className="qty" role="group" aria-label="Quantity">
          <button type="button" aria-label="Decrease quantity" onClick={() => setQuantity((value) => Math.max(1, value - 1))}>−</button>
          <span aria-live="polite">{quantity}</span>
          <button type="button" aria-label="Increase quantity" onClick={() => setQuantity((value) => Math.min(20, value + 1))}>+</button>
        </div>
        <button type="button" className="button buy-add" onClick={(event) => addToBag(event.currentTarget)}>Add to Bag</button>
      </div>
      <p className="buy-status" role="status">{status}</p>
      <p className="buy-dispatch">Roasted in Nairobi in small batches. Orders leave the roastery within 1–2 business days.</p>
      <div className="buy-bar" data-visible={barVisible} aria-hidden={!barVisible}>
        <div><p className="serif">{product.name}</p><p className="mono muted">{hasFormats ? `${formatLabel(format)} · ` : ""}{formatKes(price)}</p></div>
        <button type="button" className="button" tabIndex={barVisible ? 0 : -1} onClick={(event) => addToBag(event.currentTarget)}>Add to Bag</button>
      </div>
    </div>
  );
}
