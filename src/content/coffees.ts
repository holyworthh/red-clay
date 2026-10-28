import { redClayAssets, type RedClayAsset } from "@/lib/assets/registry";

export type ProductFamily = "material-series" | "current-harvest" | "other-ways-to-drink" | "object";

export type CoffeeId =
  | "LATERITE"
  | "BASALT"
  | "LINEN"
  | "PLUM SEASON"
  | "CANE LIGHT"
  | "HONEY BLOOM"
  | "RED ORCHARD"
  | "JASMINE AIR"
  | "BLUE HOUR"
  | "AFTERLIGHT"
  | "RED CLAY INSTANT — ETHIOPIA"
  | "THREE REGIONS";

export type ProductId = CoffeeId | "THE KILN CUP";

/** Keys for the drawn packaging system (see `PackageArt` and `ObjectArt`). */
export type PackageKey =
  | "laterite"
  | "basalt"
  | "linen"
  | "plum-season"
  | "cane-light"
  | "honey-bloom"
  | "red-orchard"
  | "jasmine-air"
  | "blue-hour"
  | "afterlight";

export type ProductArt =
  | { type: "bag"; key: PackageKey }
  | { type: "object"; key: "instant" | "regions" | "kiln" };

export type ProductMedia = {
  /** A real packshot or product photograph, used before the drawn art when present. */
  photo?: RedClayAsset;
  /** A second real photograph, used for galleries and hover states. */
  alternatePhoto?: RedClayAsset;
  origin?: RedClayAsset;
  process?: RedClayAsset;
  secondaryProcess?: RedClayAsset;
  botanical?: RedClayAsset;
  documentarySupport?: { asset: RedClayAsset; caption: string }[];
};

type ProductBase = {
  id: ProductId;
  name: string;
  slug: string;
  lotCode: string;
  family: ProductFamily;
  role: string;
  origin: string;
  region: string;
  country?: string;
  process?: string;
  varieties?: string;
  roast?: string;
  sensoryStatement: string;
  character: string;
  notes: string[];
  shortDescription: string;
  customerDirection: string;
  formats: string[];
  formatPrices?: Record<string, number>;
  grinds?: string[];
  uses: string[];
  placeHeading: string;
  placeCopy: string;
  comparison: string;
  relatedOrigin?: string;
  relatedEdition?: string;
  relatedProducts: ProductId[];
  discoveryGuide?: { name: string; direction: string }[];
  price: number | null;
  currency: string | null;
  availability: string | null;
  isActive: true;
  art: ProductArt;
  media: ProductMedia;
};

export type Coffee = ProductBase & {
  id: CoffeeId;
  kind: "coffee";
  family: Exclude<ProductFamily, "object">;
};

export type ObjectProduct = ProductBase & {
  id: "THE KILN CUP";
  kind: "kiln-cup";
  family: "object";
};

export type Product = Coffee | ObjectProduct;

const baseCommerce = {
  price: null,
  currency: "KES",
  availability: null,
  isActive: true,
} as const;

const bag = (key: PackageKey): ProductArt => ({ type: "bag", key });

export const materialSeries: Coffee[] = [
  {
    ...baseCommerce,
    id: "LATERITE",
    name: "Laterite",
    lotCode: "RC / MS / 01",
    price: 1600,
    slug: "laterite",
    kind: "coffee",
    family: "material-series",
    role: "House Coffee",
    origin: "Seasonal East African composition",
    region: "House Coffee",
    sensoryStatement: "Red plum, brown sugar, and cacao in a warm, balanced cup.",
    character: "Warm · Balanced · Generous",
    notes: ["Red plum", "brown sugar", "cacao"],
    shortDescription: "Laterite is Red Clay's centre of gravity: generous sweetness, vivid fruit, and enough depth to remain an everyday coffee.",
    customerDirection: "Start here if you want balance.",
    formats: ["250G", "1KG"],
    formatPrices: { "250G": 1600, "1KG": 5600 },
    grinds: ["Whole Bean", "Filter Grind", "Espresso Grind"],
    uses: ["Filter", "Batch", "Espresso"],
    placeHeading: "A familiar profile through the seasons.",
    placeCopy: "The East African components can change with the harvest. The cup stays centred on red plum, brown sugar, and cacao.",
    comparison: "Choose Basalt for more body and espresso. Choose Linen for a lighter, more floral filter coffee.",
    relatedProducts: ["BASALT", "LINEN", "PLUM SEASON"],
    art: bag("laterite"),
    media: { photo: redClayAssets.products.materialLaterite, alternatePhoto: redClayAssets.materials.clay },
  },
  {
    ...baseCommerce,
    id: "BASALT",
    name: "Basalt",
    lotCode: "RC / MS / 02",
    price: 1700,
    slug: "basalt",
    kind: "coffee",
    family: "material-series",
    role: "House Espresso",
    origin: "Seasonal East African composition",
    region: "House Espresso",
    sensoryStatement: "Dark cherry, cacao, and molasses with deeper sweetness and body.",
    character: "Deep · Round · Structured",
    notes: ["Dark cherry", "cacao", "molasses"],
    shortDescription: "Basalt is built for weight rather than darkness: deeper sweetness, rounder texture, and enough fruit to keep the cup alive.",
    customerDirection: "Choose Basalt for deeper sweetness, more body, or espresso.",
    formats: ["250G", "1KG"],
    formatPrices: { "250G": 1700, "1KG": 6000 },
    grinds: ["Whole Bean", "Filter Grind", "Espresso Grind"],
    uses: ["Espresso", "Moka", "Milk"],
    placeHeading: "Depth without losing the fruit.",
    placeCopy: "The seasonal composition can change while the intended profile remains steady: dark cherry, cacao, and molasses with a rounder texture.",
    comparison: "Choose Laterite for greater versatility. Choose Linen when you want the lightest coffee in the house collection.",
    relatedProducts: ["LATERITE", "RED ORCHARD", "BLUE HOUR"],
    art: bag("basalt"),
    media: { photo: redClayAssets.products.materialBasalt, alternatePhoto: redClayAssets.materials.stone },
  },
  {
    ...baseCommerce,
    id: "LINEN",
    name: "Linen",
    lotCode: "RC / MS / 03",
    price: 1800,
    slug: "linen",
    kind: "coffee",
    family: "material-series",
    role: "House Filter",
    origin: "Seasonal East African composition",
    region: "House Filter",
    sensoryStatement: "Pear, bergamot, and jasmine in a light, aromatic filter coffee.",
    character: "Light · Floral · Clean",
    notes: ["Pear", "bergamot", "jasmine"],
    shortDescription: "Linen is clean, aromatic, and deliberately light on its feet.",
    customerDirection: "Choose Linen for a lighter, floral filter coffee.",
    formats: ["250G", "1KG"],
    formatPrices: { "250G": 1800, "1KG": 6400 },
    grinds: ["Whole Bean", "Filter Grind", "Espresso Grind"],
    uses: ["Pour-over", "Batch"],
    placeHeading: "The lightest house profile.",
    placeCopy: "Its East African components can rotate with the season. Pear, bergamot, and jasmine keep the profile aromatic, clean, and recognisable.",
    comparison: "Choose Laterite for more balance and versatility. Choose Basalt for more body, espresso, or milk.",
    relatedProducts: ["LATERITE", "JASMINE AIR", "CANE LIGHT"],
    art: bag("linen"),
    media: { photo: redClayAssets.products.materialLinen },
  },
];

export const currentHarvest: Coffee[] = [
  {
    ...baseCommerce,
    id: "PLUM SEASON",
    name: "Plum Season",
    lotCode: "RC / CH / 01",
    price: 1950,
    slug: "plum-season",
    kind: "coffee",
    family: "current-harvest",
    role: "Current Harvest",
    origin: "Kenya",
    region: "Kiambu, Kenya",
    country: "Kenya",
    process: "Washed",
    varieties: "SL28 / SL34 / Ruiru 11",
    roast: "Light",
    sensoryStatement: "Blackcurrant first, then plum, settling into cane sugar as it cools.",
    character: "Bright · Structured · Clear",
    notes: ["Blackcurrant", "plum", "cane sugar"],
    shortDescription: "Blackcurrant, plum and cane sugar. A washed Kenyan coffee with clean structure and a long, dark-fruited finish.",
    customerDirection: "Choose Plum Season for darker fruit, structured acidity, and a precise cup.",
    formats: ["250G"],
    grinds: ["Whole Bean", "Filter Grind"],
    uses: ["Pour-over", "Batch"],
    placeHeading: "Kiambu, read through water and selection.",
    placeCopy: "This washed profile moves through blackcurrant and plum toward clear cane-sugar sweetness. Selection, washing, and drying are part of the context, but no one variable explains the whole cup.",
    comparison: "Plum Season is darker-fruited and more structured. Cane Light is brighter, more floral, and more citrus-led.",
    relatedOrigin: "central-kenya",
    relatedEdition: "water-and-time",
    relatedProducts: ["CANE LIGHT", "HONEY BLOOM", "JASMINE AIR"],
    art: bag("plum-season"),
    media: {
      alternatePhoto: redClayAssets.documentary.kiambuCherryDetail,
      origin: redClayAssets.documentary.kiambuLead,
      process: redClayAssets.documentary.homeProcess,
      secondaryProcess: redClayAssets.documentary.kiambuSupport,
      botanical: redClayAssets.origins.kenyaDetail,
      documentarySupport: [
        { asset: redClayAssets.documentary.kenyaWashingInfrastructure, caption: "Inactive coffee washing pits at Fairview Estate in Kiambu, Kenya; this frame does not show active washing." },
        { asset: redClayAssets.documentary.kenyaDryingTexture, caption: "Coffee drying texture at Fairview Estate in Kiambu, Kenya." },
      ],
    },
  },
  {
    ...baseCommerce,
    id: "CANE LIGHT",
    name: "Cane Light",
    lotCode: "RC / CH / 02",
    price: 2100,
    slug: "cane-light",
    kind: "coffee",
    family: "current-harvest",
    role: "Current Harvest",
    origin: "Kenya",
    region: "Kirinyaga, Kenya",
    country: "Kenya",
    process: "Washed",
    varieties: "SL28 / SL34 / Batian",
    roast: "Light",
    sensoryStatement: "Red currant first, opening into hibiscus and a pomelo finish.",
    character: "Floral · Bright · Citrus-led",
    notes: ["Red currant", "hibiscus", "pomelo"],
    shortDescription: "Red currant, hibiscus and pomelo. The more lifted of the two Kenyan coffees.",
    customerDirection: "Choose Cane Light for brighter florals and a sharper citrus line.",
    formats: ["250G"],
    grinds: ["Whole Bean", "Filter Grind"],
    uses: ["Pour-over", "Batch"],
    placeHeading: "A brighter Kenyan direction.",
    placeCopy: "Red currant, hibiscus, and pomelo make this the more lifted Kenyan profile in the Current Harvest.",
    comparison: "Cane Light is brighter, more floral, and more citrus-led. Plum Season brings darker fruit and firmer structure.",
    relatedOrigin: "central-kenya",
    relatedEdition: "water-and-time",
    relatedProducts: ["PLUM SEASON", "LINEN", "JASMINE AIR"],
    art: bag("cane-light"),
    media: {
      alternatePhoto: redClayAssets.origins.kenyaDetail,
      origin: redClayAssets.documentary.kiambuSupport,
      process: redClayAssets.origins.kenyaProcess,
      botanical: redClayAssets.documentary.kiambuCultivation,
    },
  },
  {
    ...baseCommerce,
    id: "HONEY BLOOM",
    name: "Honey Bloom",
    lotCode: "RC / CH / 03",
    price: 1900,
    slug: "honey-bloom",
    kind: "coffee",
    family: "current-harvest",
    role: "Current Harvest",
    origin: "Burundi",
    region: "Kayanza, Burundi",
    country: "Burundi",
    process: "Washed",
    varieties: "Red Bourbon",
    roast: "Light",
    sensoryStatement: "Red apple and honey, lifting into orange blossom on the finish.",
    character: "Floral · Soft · Honeyed",
    notes: ["Red apple", "honey", "orange blossom"],
    shortDescription: "Red apple, honey and orange blossom. The softer, more floral Kayanza coffee.",
    customerDirection: "Choose Honey Bloom for floral sweetness and a cleaner cup.",
    formats: ["250G"],
    grinds: ["Whole Bean", "Filter Grind"],
    uses: ["Pour-over", "Batch"],
    placeHeading: "A softer reading of Kayanza.",
    placeCopy: "This washed profile brings red apple, honey, and orange blossom into a cleaner, more floral line.",
    comparison: "Honey Bloom is cleaner, floral, and honeyed. Red Orchard is fruitier, rounder, and deeper.",
    relatedOrigin: "kayanza-burundi",
    relatedEdition: "along-the-kayanza-hills",
    relatedProducts: ["RED ORCHARD", "LATERITE", "JASMINE AIR"],
    art: bag("honey-bloom"),
    media: {
      alternatePhoto: redClayAssets.origins.burundiLead,
      origin: redClayAssets.origins.burundiLead,
      process: redClayAssets.origins.burundiLead,
      botanical: redClayAssets.origins.burundiBotanical,
    },
  },
  {
    ...baseCommerce,
    id: "RED ORCHARD",
    name: "Red Orchard",
    lotCode: "RC / CH / 04",
    price: 2050,
    slug: "red-orchard",
    kind: "coffee",
    family: "current-harvest",
    role: "Current Harvest",
    origin: "Burundi",
    region: "Kayanza, Burundi",
    country: "Burundi",
    process: "Natural",
    varieties: "Red Bourbon",
    roast: "Light",
    sensoryStatement: "Raspberry over black tea, with brown-sugar depth underneath.",
    character: "Fruit-forward · Round · Deep",
    notes: ["Raspberry", "black tea", "brown sugar"],
    shortDescription: "Raspberry, black tea and brown sugar. The deeper, fruitier Kayanza coffee.",
    customerDirection: "Choose Red Orchard for rounder fruit and deeper sweetness.",
    formats: ["250G"],
    grinds: ["Whole Bean", "Filter Grind"],
    uses: ["Pour-over", "Batch"],
    placeHeading: "The deeper Kayanza profile.",
    placeCopy: "Raspberry, black tea, and brown sugar give this coffee a rounder, fruit-forward direction. Process is one part of the contrast, not its only cause.",
    comparison: "Red Orchard is fruitier, rounder, and deeper. Honey Bloom is cleaner, more floral, and honeyed.",
    relatedOrigin: "kayanza-burundi",
    relatedEdition: "along-the-kayanza-hills",
    relatedProducts: ["HONEY BLOOM", "BASALT", "BLUE HOUR"],
    art: bag("red-orchard"),
    media: {
      alternatePhoto: redClayAssets.origins.burundiBotanical,
      origin: redClayAssets.origins.burundiSupport,
      process: redClayAssets.origins.burundiLead,
      botanical: redClayAssets.origins.burundiBotanical,
    },
  },
  {
    ...baseCommerce,
    id: "JASMINE AIR",
    name: "Jasmine Air",
    lotCode: "RC / CH / 05",
    price: 2100,
    slug: "jasmine-air",
    kind: "coffee",
    family: "current-harvest",
    role: "Current Harvest",
    origin: "Ethiopia",
    region: "Sidama, Ethiopia",
    country: "Ethiopia",
    process: "Washed",
    varieties: "Ethiopian landrace selections",
    roast: "Light",
    sensoryStatement: "Jasmine and yellow peach, finishing like lemon tea.",
    character: "Floral · Clean · Tea-like",
    notes: ["Jasmine", "yellow peach", "lemon tea"],
    shortDescription: "Jasmine, yellow peach and lemon tea. The lighter of the two Ethiopian coffees.",
    customerDirection: "Choose Jasmine Air for florality, lighter body, and a tea-like finish.",
    formats: ["250G"],
    grinds: ["Whole Bean", "Filter Grind"],
    uses: ["Pour-over", "Batch"],
    placeHeading: "A light, aromatic Ethiopian profile.",
    placeCopy: "Jasmine, yellow peach, and lemon tea give this washed Sidama coffee a clean, high-toned direction. Region and process help describe the coffee; neither predicts the cup by itself.",
    comparison: "Jasmine Air is floral, tea-like, and lighter. Blue Hour is fruit-driven, rounder, and deeper.",
    relatedOrigin: "southern-ethiopia",
    relatedEdition: "beyond-heirloom",
    relatedProducts: ["BLUE HOUR", "LINEN", "PLUM SEASON"],
    art: bag("jasmine-air"),
    media: {
      alternatePhoto: redClayAssets.origins.ethiopiaLead,
      origin: redClayAssets.origins.ethiopiaLead,
      process: redClayAssets.origins.ethiopiaDetail,
      secondaryProcess: redClayAssets.origins.ethiopiaSupport,
    },
  },
  {
    ...baseCommerce,
    id: "BLUE HOUR",
    name: "Blue Hour",
    lotCode: "RC / CH / 06",
    price: 2200,
    slug: "blue-hour",
    kind: "coffee",
    family: "current-harvest",
    role: "Current Harvest",
    origin: "Ethiopia",
    region: "Guji, Ethiopia",
    country: "Ethiopia",
    process: "Natural",
    varieties: "Ethiopian landrace selections",
    roast: "Light",
    sensoryStatement: "Strawberry and apricot, grounded by cacao nib.",
    character: "Fruit-driven · Round · Saturated",
    notes: ["Strawberry", "apricot", "cacao nib"],
    shortDescription: "Strawberry, apricot and cacao nib. The rounder, more saturated Ethiopian coffee.",
    customerDirection: "Choose Blue Hour for rounder fruit, more weight, and deeper sweetness.",
    formats: ["250G"],
    grinds: ["Whole Bean", "Filter Grind"],
    uses: ["Pour-over", "Batch"],
    placeHeading: "A fuller Ethiopian direction.",
    placeCopy: "Strawberry, apricot, and cacao nib make this the rounder, more saturated Ethiopian profile. Whole-cherry drying is one variable within a much larger coffee context.",
    comparison: "Blue Hour is fruit-driven, rounder, and deeper. Jasmine Air is floral, tea-like, and lighter.",
    relatedOrigin: "southern-ethiopia",
    relatedEdition: "beyond-heirloom",
    relatedProducts: ["JASMINE AIR", "BASALT", "RED ORCHARD"],
    art: bag("blue-hour"),
    media: {
      alternatePhoto: redClayAssets.origins.ethiopiaSupport,
      origin: redClayAssets.documentary.ethiopiaChecking,
      process: redClayAssets.origins.ethiopiaSupport,
      secondaryProcess: redClayAssets.origins.ethiopiaDetail,
    },
  },
];

export const otherWaysToDrink: Coffee[] = [
  {
    ...baseCommerce,
    id: "AFTERLIGHT",
    name: "Afterlight",
    lotCode: "RC / OW / 01",
    price: 2200,
    slug: "afterlight",
    kind: "coffee",
    family: "other-ways-to-drink",
    role: "Ethiopia Decaf",
    origin: "Ethiopia",
    region: "Ethiopia Decaf",
    country: "Ethiopia",
    process: "Water-process decaf",
    roast: "Medium-light",
    sensoryStatement: "All of the evening, none of the caffeine.",
    character: "Sweet · Round · Decaffeinated",
    notes: ["Plum", "cocoa", "honey"],
    shortDescription: "Plum, cocoa and honey. An Ethiopian decaf for the evening cup, roasted a touch further than our light coffees.",
    customerDirection: "Choose Afterlight when you want the depth of a Red Clay coffee without the usual caffeine.",
    formats: ["250G"],
    grinds: ["Whole Bean", "Filter Grind", "Espresso Grind"],
    uses: ["Filter", "Espresso"],
    placeHeading: "For the last cup of the day.",
    placeCopy: "Brew it as you would any filter coffee. Decaffeination happens before roasting, so the cup keeps its fruit and sweetness.",
    comparison: "Choose Laterite for a caffeinated all-rounder. Choose Basalt for more espresso weight and deeper sweetness.",
    relatedProducts: ["JASMINE AIR", "LATERITE", "BLUE HOUR"],
    art: bag("afterlight"),
    media: { alternatePhoto: redClayAssets.ritual.pourOver },
  },
  {
    ...baseCommerce,
    id: "RED CLAY INSTANT — ETHIOPIA",
    name: "Red Clay Instant — Ethiopia",
    lotCode: "RC / OW / 02",
    price: 2300,
    slug: "red-clay-instant",
    kind: "coffee",
    family: "other-ways-to-drink",
    role: "Specialty Instant",
    origin: "Ethiopia",
    region: "Ethiopia · 6 sachets",
    country: "Ethiopia",
    sensoryStatement: "Specialty coffee that travels in a pocket.",
    character: "Direct · Portable · Ready",
    notes: [],
    shortDescription: "For the road, the office and the morning without a grinder. One sachet, one cup of hot water.",
    customerDirection: "Choose Instant when convenience matters more than bringing the full brew setup.",
    formats: ["6 SACHETS"],
    grinds: [],
    uses: ["Travel", "Office"],
    placeHeading: "Tear, pour, stir.",
    placeCopy: "Empty one sachet into a cup, add hot water and stir. Adjust the water to taste.",
    comparison: "Choose Three Regions when you want to compare three brewed coffees. Choose Afterlight when caffeine is the deciding factor.",
    relatedProducts: ["AFTERLIGHT", "JASMINE AIR", "BLUE HOUR"],
    art: { type: "object", key: "instant" },
    media: { alternatePhoto: redClayAssets.ritual.hands },
  },
  {
    ...baseCommerce,
    id: "THREE REGIONS",
    name: "Three Regions",
    lotCode: "RC / OW / 03",
    price: 2800,
    slug: "three-regions",
    kind: "coffee",
    family: "other-ways-to-drink",
    role: "Discovery Box",
    origin: "Kenya · Burundi · Ethiopia",
    region: "Discovery Box · 3 × 100G",
    process: "All washed",
    roast: "Light",
    sensoryStatement: "Same process, three places. The clearest way to hear what region means in a cup.",
    character: "Bright · Soft · Aromatic",
    notes: ["Plum Season", "Honey Bloom", "Jasmine Air"],
    shortDescription: "Taste the collection by place before choosing a full bag. One coffee each from Central Kenya, Kayanza and Southern Ethiopia.",
    customerDirection: "Start here if you do not yet know which regional profile suits you.",
    formats: ["3 × 100G"],
    grinds: ["Whole Bean", "Filter Grind"],
    uses: ["Filter comparison"],
    placeHeading: "Inside the box.",
    placeCopy: "Brew all three the same way, taste them side by side, then choose a full bag from the region that held your attention.",
    comparison: "Plum Season is bright and structured. Honey Bloom is soft and floral. Jasmine Air is light and aromatic.",
    relatedProducts: ["PLUM SEASON", "HONEY BLOOM", "JASMINE AIR"],
    discoveryGuide: [
      { name: "PLUM SEASON", direction: "Kiambu, Kenya · Bright · Structured" },
      { name: "HONEY BLOOM", direction: "Kayanza, Burundi · Soft · Floral" },
      { name: "JASMINE AIR", direction: "Sidama, Ethiopia · Light · Aromatic" },
    ],
    art: { type: "object", key: "regions" },
    media: {},
  },
];

export const kilnCup: ObjectProduct = {
  ...baseCommerce,
  id: "THE KILN CUP",
  name: "The Kiln Cup",
  lotCode: "Object",
  price: 5900,
  slug: "the-kiln-cup",
  kind: "kiln-cup",
  family: "object",
  role: "Companion object",
  origin: "High-fired stoneware",
  region: "Iron-rich stoneware",
  sensoryStatement: "Made to be used every morning, and never more important than the coffee in it.",
  character: "Exposed red clay · Mineral-white satin glaze",
  notes: ["Exposed red clay", "mineral-white satin glaze"],
  shortDescription: "Clay outside. Glaze within. A compact cup for the first coffee of the day, with an exposed red exterior and a warm white interior.",
  customerDirection: "Choose the coffee first. The Kiln Cup remains its companion.",
  formats: ["Approx. 300ML"],
  grinds: [],
  uses: ["Filter coffee", "Long black", "Everyday coffee"],
  placeHeading: "A compact, gently tapered cup.",
  placeCopy: "The form is a gently tapered, handleless cup, with an exposed red clay exterior and a warm mineral-white satin glaze inside.",
  comparison: "Pair it with Laterite for balance, Linen for a lighter filter, or a coffee from the Current Harvest.",
  relatedProducts: ["LATERITE", "PLUM SEASON", "AFTERLIGHT"],
  art: { type: "object", key: "kiln" },
  media: { photo: redClayAssets.objects.kilnPlinth, alternatePhoto: redClayAssets.objects.kilnRakingLight },
};

export const coffees: Coffee[] = [...materialSeries, ...currentHarvest, ...otherWaysToDrink];
export const objects: ObjectProduct[] = [kilnCup];
export const allActiveProducts: Product[] = [...coffees, ...objects];
export const products = allActiveProducts;

export function getProductBySlug(slug: string) {
  return allActiveProducts.find((product) => product.slug === slug);
}

export function getProductById(id: ProductId) {
  return allActiveProducts.find((product) => product.id === id);
}

export function getProductVariantPrice(product: Product, variant: { format?: string } = {}) {
  return product.formatPrices?.[variant.format ?? product.formats[0]] ?? product.price;
}

export function formatKes(value: number | null | undefined) {
  if (value == null) return "KES —";
  return `KES ${new Intl.NumberFormat("en-KE", { maximumFractionDigits: 0 }).format(value)}`;
}

/** "250G" → "250 g", "1KG" → "1 kg", "3 × 100G" → "3 × 100 g"; other formats read as written. */
export function formatLabel(format?: string) {
  if (!format) return "";
  return format.replace(/(\d)KG$/, "$1 kg").replace(/(\d)G$/, "$1 g");
}

export function priceLabel(product: Product) {
  const values = product.formatPrices ? Object.values(product.formatPrices) : [];
  if (values.length > 1) return `From ${formatKes(Math.min(...values))}`;
  return formatKes(product.price);
}

/** "Kiambu, Kenya · Washed" for harvest coffees, the role otherwise. */
export function productMeta(product: Product) {
  if (product.family === "current-harvest") return `${product.region} · ${product.process}`;
  return product.role;
}
