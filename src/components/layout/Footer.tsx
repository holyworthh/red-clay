"use client";

import Link from "next/link";
import { type FormEvent, useState } from "react";

const shopLinks = [
  { label: "All coffee", href: "/shop" },
  { label: "The Material Series", href: "/shop#material-series" },
  { label: "Current Harvest", href: "/shop#current-harvest" },
  { label: "Other ways to drink", href: "/shop#other-ways" },
  { label: "The Kiln Cup", href: "/shop/the-kiln-cup" },
];

const readLinks = [
  { label: "Origins", href: "/origins" },
  { label: "The Earthen Folio", href: "/origins#folio" },
  { label: "Editions", href: "/journal" },
  { label: "About", href: "/about" },
];

export function Footer() {
  const [message, setMessage] = useState("");
  const [invalid, setInvalid] = useState(false);

  function join(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = new FormData(event.currentTarget).get("email")?.toString().trim() ?? "";
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    setInvalid(!valid);
    setMessage(valid ? "Thank you. The next letter will find you." : "That address looks incomplete. Check the part after the @.");
    if (valid) event.currentTarget.reset();
  }

  return (
    <footer className="site-footer">
      <div className="site-footer-strip">
        <div className="wrap site-footer-strip-inner">
          <span>Roasted in Nairobi in small batches. Orders leave the roastery within 1–2 business days.</span>
          <span>Free Kenya delivery from KES 5,000</span>
        </div>
      </div>
      <div className="wrap site-footer-grid">
        <form className="site-footer-signup" onSubmit={join} noValidate>
          <p className="mono site-footer-label">Letters from the roastery</p>
          <p className="serif site-footer-pitch">New harvests, Editions and brewing notes. A few times a season.</p>
          <div className="site-footer-field">
            <label className="sr-only" htmlFor="footer-email">Email address</label>
            <input id="footer-email" name="email" type="email" placeholder="Email address" autoComplete="email" aria-invalid={invalid} aria-describedby="footer-email-status" />
            <button type="submit">Subscribe</button>
          </div>
          <p id="footer-email-status" className={`site-footer-status ${invalid ? "is-error" : ""}`} role="status">{message}</p>
        </form>
        <nav aria-label="Shop" className="site-footer-links">
          <span className="mono site-footer-label">Shop</span>
          {shopLinks.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}
        </nav>
        <nav aria-label="Read" className="site-footer-links">
          <span className="mono site-footer-label">Read</span>
          {readLinks.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}
        </nav>
      </div>
      <div className="wrap site-footer-mark" aria-hidden="true">
        <svg viewBox="0 0 1000 214" preserveAspectRatio="xMidYMid meet">
          <text x="500" y="170" textAnchor="middle" textLength="1000" lengthAdjust="spacing">Red Clay</text>
        </svg>
      </div>
      <div className="wrap site-footer-base">
        <p>Red Clay Coffee is an independently created fictional brand concept. Regional editorial content is informed by researched coffee context. People and locations shown in documentary imagery do not represent commercial Red Clay sourcing relationships.</p>
        <p className="mono">Coffee, held by place · © 2026</p>
      </div>
    </footer>
  );
}
