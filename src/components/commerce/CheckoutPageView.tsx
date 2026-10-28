"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useMemo, useState } from "react";
import { getBagLineKey, useBag, type BagItem } from "@/components/commerce/BagProvider";
import { ProductVisual } from "@/components/product/ProductVisual";
import { formatKes, formatLabel, getProductById } from "@/content/coffees";
import { redClayAssets } from "@/lib/assets/registry";

const FREE_DELIVERY = 5000;
const STEPS = ["Contact", "Delivery", "Method", "Payment", "Review"] as const;
const METHODS = [
  { id: "nairobi", label: "Nairobi", eta: "1–2 business days", price: 300, kenya: true },
  { id: "kenya", label: "Rest of Kenya", eta: "2–4 business days", price: 500, kenya: true },
  { id: "international", label: "International (demo rate)", eta: "Shown for demonstration only", price: 3500, kenya: false },
] as const;
const PAYMENTS = [
  { id: "mpesa", label: "M-Pesa", note: "Pay from your phone", demo: "In the live shop you would confirm an M-Pesa prompt on your phone. No prompt is sent here." },
  { id: "card", label: "Card", note: "Visa or Mastercard", demo: "In the live shop, card details would be entered on the payment provider’s secure page. No card details are requested here." },
] as const;

type Details = { email: string; phone: string; firstName: string; lastName: string; address: string; city: string; country: string };
const emptyDetails: Details = { email: "", phone: "", firstName: "", lastName: "", address: "", city: "", country: "Kenya" };

const itemPrice = (item: BagItem) => item.price ?? getProductById(item.id)?.price ?? null;

const createDemoOrderId = () => {
  const date = new Date().toISOString().slice(2, 10).replaceAll("-", "");
  const token = globalThis.crypto.randomUUID().replaceAll("-", "").slice(0, 4).toUpperCase();
  return `RC-DEMO-${date}-${token}`;
};

function validate(step: number, details: Details) {
  const errors: Partial<Record<keyof Details, string>> = {};
  if (step === 0) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email)) errors.email = "Enter an email address, like name@example.com.";
    if (details.phone.replace(/\D/g, "").length < 9) errors.phone = "Enter a phone number so the courier can reach you.";
  }
  if (step === 1) {
    if (!details.firstName.trim()) errors.firstName = "Enter a first name.";
    if (!details.lastName.trim()) errors.lastName = "Enter a last name.";
    if (!details.address.trim()) errors.address = "Enter a street address.";
    if (!details.city.trim()) errors.city = "Enter a town or city so we can choose the right delivery rate.";
  }
  return errors;
}

export function CheckoutPageView() {
  const router = useRouter();
  const { items, clear } = useBag();
  const [step, setStep] = useState(0);
  const [details, setDetails] = useState<Details>(emptyDetails);
  const [errors, setErrors] = useState<Partial<Record<keyof Details, string>>>({});
  const [method, setMethod] = useState<(typeof METHODS)[number]["id"]>("nairobi");
  const [placing, setPlacing] = useState(false);
  const [payment, setPayment] = useState<(typeof PAYMENTS)[number]["id"]>("mpesa");
  const subtotal = useMemo(() => items.reduce((sum, item) => sum + (itemPrice(item) ?? 0) * item.quantity, 0), [items]);
  const chosen = METHODS.find((item) => item.id === method)!;
  const free = subtotal >= FREE_DELIVERY;
  const shipping = free && chosen.kenya ? 0 : chosen.price;
  const total = subtotal + shipping;
  const pay = PAYMENTS.find((item) => item.id === payment)!;

  if (items.length === 0 && !placing) {
    return (
      <main id="main-content" className="checkout">
        <CheckoutTop />
        <div className="wrap checkout-empty">
          <p className="serif display-m">Your Bag is empty.</p>
          <p>Add something from the collection before you check out.</p>
          <Link className="button" href="/shop">Browse the collection</Link>
        </div>
      </main>
    );
  }

  const update = (key: keyof Details) => (event: { target: { value: string } }) => setDetails((current) => ({ ...current, [key]: event.target.value }));

  function next(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = validate(step, details);
    setErrors(found);
    if (Object.keys(found).length) {
      document.getElementById(`field-${Object.keys(found)[0]}`)?.focus();
      return;
    }
    if (step === 1 && details.country !== "Kenya" && method !== "international") setMethod("international");
    if (step === 1 && details.country === "Kenya" && method === "international") setMethod(details.city.trim().toLowerCase() === "nairobi" ? "nairobi" : "kenya");
    if (step < STEPS.length - 1) { setStep(step + 1); window.scrollTo({ top: 0 }); return; }
    const order = createDemoOrderId();
    setPlacing(true);
    clear();
    router.push(`/checkout/complete?order=${encodeURIComponent(order)}&total=${total}&method=${encodeURIComponent(chosen.label)}`);
  }

  const field = (key: keyof Details, label: string, type = "text", autoComplete?: string) => (
    <div className="field">
      <label htmlFor={`field-${key}`}>{label}</label>
      <input id={`field-${key}`} type={type} value={details[key]} onChange={update(key)} autoComplete={autoComplete} aria-invalid={Boolean(errors[key])} aria-describedby={errors[key] ? `error-${key}` : undefined} />
      {errors[key] && <span id={`error-${key}`} className="field-error">{errors[key]}</span>}
    </div>
  );

  return (
    <main id="main-content" className="checkout">
      <CheckoutTop />
      <div className="wrap checkout-body">
        <ol className="checkout-steps" aria-label="Checkout steps">
          {[...STEPS, "Complete"].map((label, index) => <li key={label} aria-current={index === step ? "step" : undefined} data-done={index <= step}><span className="mono">0{index + 1}</span><span>{label}</span></li>)}
        </ol>
        <div className="checkout-grid">
          <form className="checkout-form" onSubmit={next} noValidate>
            {Object.keys(errors).length > 0 && <p className="form-alert" role="alert">{Object.keys(errors).length === 1 ? "One field needs attention before you can continue." : `${Object.keys(errors).length} fields need attention before you can continue.`}</p>}
            {step === 0 && <>
              <h1 className="serif display-m">Contact</h1>
              <p className="muted">Used for this demo on screen only. Nothing you type is stored or sent.</p>
              {field("email", "Email address", "email", "email")}
              {field("phone", "Phone (for delivery updates)", "tel", "tel")}
            </>}
            {step === 1 && <>
              <h1 className="serif display-m">Delivery address</h1>
              <div className="field-pair">{field("firstName", "First name", "text", "given-name")}{field("lastName", "Last name", "text", "family-name")}</div>
              {field("address", "Street address", "text", "street-address")}
              <div className="field-pair">
                {field("city", "Town or city", "text", "address-level2")}
                <div className="field"><label htmlFor="field-country">Country</label><select id="field-country" value={details.country} onChange={update("country")}><option value="Kenya">Kenya</option><option value="Other">Other (demo rate)</option></select></div>
              </div>
            </>}
            {step === 2 && <>
              <h1 className="serif display-m">Delivery method</h1>
              <div className="choices" role="radiogroup" aria-label="Delivery method">
                {METHODS.filter((item) => (details.country === "Kenya" ? item.kenya : !item.kenya)).map((item) => (
                  <button key={item.id} type="button" role="radio" aria-checked={method === item.id} className="choice" onClick={() => setMethod(item.id)}>
                    <span className="choice-dot" aria-hidden="true" /><span><span>{item.label}</span><span className="small muted">{item.eta}</span></span><span>{free && item.kenya ? "Free" : formatKes(item.price)}</span>
                  </button>
                ))}
              </div>
              <p className="small muted">Free Kenya delivery from KES 5,000. The international rate is a demo rate.</p>
            </>}
            {step === 3 && <>
              <h1 className="serif display-m">Payment</h1>
              <div className="choices" role="radiogroup" aria-label="Payment method">
                {PAYMENTS.map((item) => (
                  <button key={item.id} type="button" role="radio" aria-checked={payment === item.id} className="choice" onClick={() => setPayment(item.id)}>
                    <span className="choice-dot" aria-hidden="true" /><span><span>{item.label}</span><span className="small muted">{item.note}</span></span><span className="mono muted">Demo</span>
                  </button>
                ))}
              </div>
              <p className="demo-note"><strong>Demo only.</strong> {pay.demo}</p>
            </>}
            {step === 4 && <>
              <h1 className="serif display-m">Review</h1>
              <dl className="review">
                {[
                  ["Contact", `${details.email}\n${details.phone}`, 0],
                  ["Deliver to", `${details.firstName} ${details.lastName}\n${details.address}, ${details.city}, ${details.country === "Kenya" ? "Kenya" : "outside Kenya"}`, 1],
                  ["Method", `${chosen.label} · ${chosen.eta}`, 2],
                  ["Payment", `${pay.label} (demo)`, 3],
                ].map(([key, value, target]) => <div key={key as string}><dt className="mono muted">{key}</dt><dd>{value}</dd><dd><button type="button" className="link-button" onClick={() => setStep(target as number)}>Edit</button></dd></div>)}
              </dl>
            </>}
            <div className="checkout-nav">
              <button type="button" className="link-button" style={{ visibility: step === 0 ? "hidden" : "visible" }} onClick={() => { setErrors({}); setStep(step - 1); }}>Back</button>
              <button type="submit" className="button">{step === STEPS.length - 1 ? "Place demo order" : "Continue"}</button>
            </div>
          </form>
          <aside className="checkout-summary" aria-label="Order summary">
            <p className="mono muted">Order summary</p>
            <ul>
              {items.map((item) => {
                const product = getProductById(item.id);
                const price = itemPrice(item);
                return <li key={getBagLineKey(item)}>
                  <span className="ratio-4-5">{product && <ProductVisual product={product} sizes="64px" scale="thumb" />}</span>
                  <span><span className="serif">{product?.name ?? item.id}</span><span className="mono muted">{formatLabel(item.format)} · ×{item.quantity}</span></span>
                  <span>{formatKes(price == null ? null : price * item.quantity)}</span>
                </li>;
              })}
            </ul>
            <div className="checkout-totals">
              <div><span>Subtotal</span><span>{formatKes(subtotal)}</span></div>
              <div><span>Delivery · {chosen.label.replace(" (demo rate)", "")}</span><span>{shipping === 0 ? "Free" : formatKes(shipping)}</span></div>
              <p className="small muted">{free ? "Free Kenya delivery applied." : `${formatKes(FREE_DELIVERY - subtotal)} away from free Kenya delivery.`}</p>
            </div>
            <div className="checkout-total"><span>Total</span><span className="serif">{formatKes(total)}</span></div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function CheckoutTop() {
  return <p className="demo-banner" role="note">Portfolio demo checkout — no payment is collected and no order is fulfilled.</p>;
}

export function CheckoutCompleteView({ order, total, method }: Readonly<{ order?: string; total?: string; method?: string }>) {
  const totalValue = total && /^\d+$/.test(total) ? Number(total) : null;
  return (
    <main id="main-content" className="checkout">
      <CheckoutTop />
      <div className="wrap checkout-complete">
        <p className="mono accent">Demo order complete</p>
        <h1 className="serif display-l">Thank you for making time for coffee.</h1>
        <p>This is where your confirmation would appear. In this portfolio demo, no payment was taken and nothing will be shipped. Nothing you entered was saved.</p>
        <dl className="complete-facts">
          <div><dt className="mono muted">Reference</dt><dd>{order || "RC-DEMO"}</dd></div>
          {method && <div><dt className="mono muted">Delivery</dt><dd>{method}</dd></div>}
          {totalValue != null && <div><dt className="mono muted">Total</dt><dd>{formatKes(totalValue)}</dd></div>}
        </dl>
        <div className="ratio-16-9"><Image src={redClayAssets.objects.kilnRakingLight.src} alt={redClayAssets.objects.kilnRakingLight.alt} fill sizes="(max-width: 820px) 100vw, 60vw" /></div>
        <div className="button-row"><Link className="button" href="/origins">Read The Earthen Folio</Link><Link className="text-link" href="/shop">Continue browsing</Link></div>
      </div>
    </main>
  );
}
