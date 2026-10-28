"use client";

import { BagContents } from "@/components/commerce/CartDrawer";

export function BagPageView() {
  return (
    <main id="main-content" className="wrap bag-page">
      <p className="mono muted">Bag</p>
      <h1 className="serif display-l">Your Bag</h1>
      <BagContents />
    </main>
  );
}
