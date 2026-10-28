import { redClayAssets } from "@/lib/assets/registry";

export type HeroTone = "light" | "dark";

export type HeroSlide = {
  id: string;
  label: string;
  caption: string;
  image: string;
  alt: string;
  objectPosition?: string;
  headerTone: HeroTone;
};

export const homeHeroToneEvent = "red-clay:home-hero-tone";

export const homeHeroSlides = [
  {
    id: "place",
    label: "Place",
    caption: "Fairview Estate, Kiambu",
    image: redClayAssets.documentary.kiambuLead.src,
    alt: redClayAssets.documentary.kiambuLead.alt,
    objectPosition: "50% 55%",
    headerTone: "light",
  },
  {
    id: "process",
    label: "Process",
    caption: "Drying rack, Kiambu",
    image: redClayAssets.documentary.homeProcess.src,
    alt: redClayAssets.documentary.homeProcess.alt,
    objectPosition: "50% 48%",
    headerTone: "light",
  },
  {
    id: "ritual",
    label: "Ritual",
    caption: "Early light",
    image: redClayAssets.ritual.pourOver.src,
    alt: redClayAssets.ritual.pourOver.alt,
    objectPosition: "50% 45%",
    headerTone: "light",
  },
] as const satisfies readonly HeroSlide[];
