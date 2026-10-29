# Red Clay Coffee — Motion & Interaction System

**Document version:** 2.1.0
**Change note:** 2.1 adds directional plate reveals, makes the hero exactly one viewport tall and the Edition panel full-bleed, and removes CSS/GSAP transform conflicts found in a smoothness audit.
**Date:** 2026-10-29
**Status:** Implemented. This replaces the 1.x "quiet motion" draft, which no longer matches the redesigned site.
**Code:** `src/lib/motion/` (plan + scenes), `src/components/motion/` (runtime, cursor), motion block in `src/app/globals.css`.

## Thesis

The site tells one story — **earth becomes coffee, coffee meets the vessel, the vessel holds a ritual** — and motion is how a visitor feels that story move. Every page is a sequence of plates and lines that *arrive*: images open like a window being unshuttered, type rises out of its own baseline, and the red earth of the brand is the plane that carries you from one page to the next.

Motion should feel like print coming to life, not like an app performing. It is generous on editorial surfaces and deliberately quiet where people buy.

**Vocabulary:** rectangular masks, line-by-line type rises, slow image settles, bounded parallax inside frames, scrubbed sequences, one pinned story per page at most, a clay-coloured transition plane.
**Never:** bounce, overshoot, spin, 3D tilt, blur reveals, confetti, auto-advancing product imagery, motion that delays Add to Bag, the menu or the bag.

## Tokens

| Token | Value | Use |
|---|---|---|
| `ease.reveal` | `expo.out` (≈ `cubic-bezier(.16,1,.3,1)`) | Type rises, image settles |
| `ease.mask` | `expo.inOut` | Clip-path reveals, page curtain |
| `ease.soft` | `power3.out` | Fades, small UI |
| `dur.ui` | 0.25–0.4s | Hover, buttons, gallery frames |
| `dur.line` | 1.15s, stagger 0.08s | Headline line rises |
| `dur.fade` | 1.0s, stagger 0.08s, travel 28px | Eyebrows, body groups, captions |
| `dur.mask` | 1.35s clip + 1.8s image settle | Image plates |
| `dur.card` | 1.2s, stagger 0.1s, travel 60px | Product cards |
| `dur.curtain` | 0.75s cover, 0.9s uncover | Page transitions |
| `parallax` | image scale 1.16, `yPercent ±7` | Large plates only |
| Reveal trigger | `clamp(top 88%)` (`clamp(top 92%)` for plates and cards), `once` | All entrances; `clamp()` lets elements near the page bottom still fire |

## Runtime architecture

- **GSAP 3.15** (ScrollTrigger, SplitText) and **Lenis 1.3** smooth scroll, synced through `gsap.ticker`. Lenis keeps native scroll, so `position: sticky`, anchors and the browser's own scroll restoration keep working. Touch devices keep native scrolling.
- **One runtime, declarative plan.** `src/lib/motion/plan.ts` maps CSS selectors to reveal types. The layout renders the plan's "pre-hidden" selector into a `<style>` tag, so server-rendered content never flashes before its entrance. The client runtime (`MotionRoot`) builds every scene in a `gsap.context()` after each route commit and reverts it on the next route. Pages stay server components; adding motion to a new element means adding a selector to the plan.
- **Failsafe.** An inline script adds `html.js-motion` only when motion is allowed. If the runtime has not reported ready within 4 seconds, the class is removed and every element is shown in its final state.
- **Reduced motion** (`prefers-reduced-motion: reduce`): no intro, no curtain, no Lenis, no pins, no scrubbing, no parallax, no hero autoplay. Every element renders in its final state. Hover colour/opacity feedback remains.

## Reveal types (site-wide)

| Type | What happens | Applied to |
|---|---|---|
| `lines` | SplitText lines in masks rise `yPercent 110 → 0` | `h1`, display headings, Edition/product titles, standfirsts, Folio descriptors, footer pitch |
| `fade` | `y 28 → 0`, opacity, batched stagger | Mono eyebrows, button rows, line links, Folio blocks, article paragraphs, captions, steps, facts |
| `mask` | Frame clip opens from one edge while the image settles from +0.22 scale (and slides 6% on horizontal wipes). Direction comes from `MASK_DIRECTIONS` in `plan.ts`; unlisted plates open upward | Every ratio frame and named media plate |
| `parallax` | Image `yPercent −7 → 7` scrubbed across the viewport | Wide plates: product place plate, dossier/article/about heroes, shop interlude, origin tiles, Edition features, Kiln ritual |
| `cards` | Batched card rise `y 60 → 0` with stagger | Product cards in every grid |
| `rule` | Clip from the left `inset(0 100% 0 0) → 0` | Section rules |

Elements inside the hero, checkout, bag and gallery are excluded from the generic plan; they have their own behaviour.

### Reveal directions

Plates do not all open the same way. Pairs open toward each other, and reading-page heroes drop from the top like a page being lowered:

| Surface | Direction |
|---|---|
| Home origins | Kenya opens leftward, Burundi rightward, Ethiopia upward |
| Kiln section | Ritual photo rightward, Kiln Cup leftward |
| Article, dossier, About and product-place heroes | Downward |
| Editions | Featured plate rightward; stories downward and leftward |
| Shop interlude | Leftward |
| About rows, Folio support, product process plates | Alternate rightward / leftward |
| Continuum stage | Coffee from the right, Vessel from below, Ritual from the left (grid on mobile alternates up/left/down/right) |
| Folio plates | Kenya upward, Burundi downward, Ethiopia rightward |
| Type, cards | Always rise; the variety lives in the images |

## Signature scenes

### First visit — intro (once per session)
Dark field; the wordmark's letters rise (stagger 0.04s), a hairline draws under it, "Coffee, held by place" fades in, then the field lifts away (`expo.inOut`, 1.1s) and hands straight into the hero. Total ≈ 2.2s. Skipped for returning sessions and reduced motion; content underneath is already rendered.

### Page transitions — the clay plane
Any internal link: a red-clay plane (`--accent`) wipes up over the page carrying the destination's name in Newsreader, the route changes underneath, then the plane lifts off the new page while its content rises 60px into place. Back/forward navigation, modified clicks, new tabs, downloads and same-page anchors are never intercepted. Same-page anchors scroll smoothly through Lenis. A 6-second failsafe always uncovers.

### Home hero
- Exactly one viewport tall (`100lvh`), so nothing of the next section shows on load.
- Entrance: the frame opens from `inset(12% 8%)` while the image settles from 1.25×; story selectors rise in sequence; the line "Coffee, held by place." rises.
- Slides: the next image wipes in from the right over the current one (1.4s), with a slow 1.12 → 1 settle. The active selector carries a hairline that fills over the 6s autoplay interval and freezes when paused.
- Scroll out: the image drifts down (`yPercent 18`) and the selectors lift and fade as the hero leaves.

### Continuum — the pinned story (desktop ≥ 1024 × 640)
The section pins for three screens. The headline lights up word by word; the four frames — Earth, Coffee, Vessel, Ritual — wipe up one over another inside a single stage while the previous frame recedes; a `01 / 04` counter and a hairline track the beat. Mobile and reduced motion keep the four-up grid with simple reveals.

### Material Series band
The field opens from a narrow window to full bleed as it scrolls in, and the three bags rise out of it at different speeds (Basalt, the middle bag, travels furthest). On the way out the middle bag keeps drifting for depth. The rise and the drift live on different elements (`.home-material-bag` and `.home-material-bag-drift`) so the two scrubbed tweens never fight over one property. Hovering a bag lifts it 10px.

### Edition panel ("the window")
The panel is full-bleed and one viewport tall (560–1000px). It opens from an inset window to the full screen width as it scrolls in, with the image settling from 1.35× underneath; the title rises line by line.

### The Kiln Cup
The object photo settles as you scroll while a band of warm raking light sweeps across it — the kiln's light passing over the glaze. The ritual photo drifts on its own parallax.

### Earthen Folio (`/origins`)
- A clay progress hairline under the chapter bar fills across all three chapters; the current chapter's link is marked (`aria-current="step"`).
- Desktop (sticky plates): each plate opens from below as its chapter arrives and its image settles slowly (1.25 → 1) across the whole chapter. The large chapter number rolls up digit by digit.
- Mobile: plates use the standard `mask` reveal.

### Product page
Gallery stage and buy column rise in on load; switching gallery views wipes the new frame in from the right (0.6s). The place plate gets parallax, process images mask in, related cards rise. The buy box, sticky bar and Add to Bag never wait on motion.

### Editions and articles
Mastheads rise line by line; featured plates mask and drift. Articles carry a clay reading-progress hairline at the top of the viewport; figures mask in; paragraphs fade in as small batches.

### Footer
The footer's columns fade up, and the giant **Red Clay** wordmark rises out of the bottom edge as the page ends, settling exactly as the last pixel scrolls in.

## Interactions

| Interaction | Behaviour |
|---|---|
| Header | Sticky everywhere. Hides on scroll down after 120px, returns on any scroll up. On home it stays transparent over the hero, then turns solid. Never hides while a menu, mega panel or the bag is open. |
| Cursor label | Desktop fine pointers only: a 88px clay disc labelled *View*, *Read* or *Explore* follows the pointer over product cards, Editions and origin tiles. The native cursor stays. |
| Magnetic buttons | Primary buttons lean up to 25% toward the pointer and spring back. |
| Product cards | Front image settles 1.04× and the bag's back wipes up from the bottom (0.8s). |
| Text links | Underline retracts to the right and redraws from the left on hover. |
| Line links | The arrow slides 6px; the rule darkens. |
| Mega menus | Field drops with a clip (0.35s); rows cascade 0.055s apart. |
| Bag drawer, mobile menu | Smooth scroll pauses while open; drawer slides in 0.4s. |

## Performance and accessibility rules

- Animate transform, opacity and clip-path only. No filter animation.
- Never put a CSS `transition` on a property GSAP drives. Hover zoom on GSAP-driven photos (origin tiles, Editions) is a GSAP tween relative to the image's base scale, not a CSS `:hover` transform.
- SplitText uses `aria: "auto"` except inside links and buttons, where it uses `aria: "none"` so the link's accessible name stays intact.
- ScrollTriggers refresh after fonts load and after layout-affecting splits.
- Pins only at ≥ 1024px width and ≥ 640px height.
- No motion blocks reading, navigation, Add to Bag or checkout. Checkout and the bag page have no scroll choreography.
- Every scene has a complete static state (no JS, reduced motion, failed runtime).

## QA checklist

- [ ] 390, 768, 1366×768, 1440 widths; reduced-motion mode; JavaScript disabled.
- [ ] No content flash before entrances; no element left hidden after scrolling the full page.
- [ ] Page transition never traps the user (back/forward, new tab, modifier clicks, same-page anchors).
- [ ] Pinned continuum releases cleanly into the Material band; no overlap with the header.
- [ ] Drawer and mobile menu scroll internally while page scroll is paused.
- [ ] Lighthouse: no long tasks from scroll handlers; CLS 0 from motion.
- [ ] Smoothness audit: scroll each page end-to-end twice at a constant speed and record every tracked element's on-screen position per frame. Scrubbed motion must never reverse against the scroll direction on the second pass, and frames over 34ms must stay under 0.2%. (2026-10-29: home, Folio and product page pass; 0–2 slow frames per ~1,500.)
