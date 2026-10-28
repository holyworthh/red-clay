import { currentHarvest } from "./coffees";
import { origins } from "./origins";
import { redClayAssets } from "@/lib/assets/registry";

export const navigation = {
  primary: [
    { label: "Shop", href: "/shop" },
    { label: "Origins", href: "/origins" },
    { label: "Editions", href: "/journal" },
    { label: "About", href: "/about" },
  ],
  shopMenu: {
    coffee: [
      { label: "All Shop", href: "/shop" },
      { label: "The Material Series", href: "/shop#material-series" },
      { label: "Current Harvest", href: "/shop#current-harvest" },
      { label: "Other ways to drink", href: "/shop#other-ways" },
    ],
    harvest: currentHarvest.map((coffee) => ({ label: coffee.name, meta: coffee.region.split(",")[0], href: `/shop/${coffee.slug}` })),
    object: [{ label: "The Kiln Cup", href: "/shop/the-kiln-cup" }],
  },
  originMenu: [
    { label: "All Origins", meta: "Three regions", href: "/origins", image: redClayAssets.documentary.kiambuLead, caption: "Fairview Estate, Kiambu" },
    ...origins.map((origin) => ({
      label: origin.name,
      meta: origin.slug === "central-kenya" ? "Kiambu · Kirinyaga" : origin.slug === "kayanza-burundi" ? "Washed · Natural" : "Sidama · Guji",
      href: `/origins/${origin.slug}`,
      image: origin.slug === "central-kenya" ? redClayAssets.origins.kenyaProcess : origin.slug === "kayanza-burundi" ? redClayAssets.origins.burundiLead : redClayAssets.origins.ethiopiaLead,
      caption: origin.slug === "central-kenya" ? "Sorting cherries, Kenya" : origin.slug === "kayanza-burundi" ? "Processing landscape, Kayanza" : "Coffee checking, Ethiopia",
    })),
    { label: "The Earthen Folio", meta: "Read", href: "/origins#folio", image: redClayAssets.documentary.homeProcess, caption: "Drying rack, Kiambu" },
  ],
} as const;
