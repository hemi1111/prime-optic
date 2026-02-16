export type LensType = {
  id: string;
  name: string;
  description: string;
  priceAdjustment: number; // Additional cost for this lens type
};

export const LENS_TYPES: LensType[] = [
  {
    id: "single-vision",
    name: "Single Vision",
    description: "Standard prescription lenses for distance or reading",
    priceAdjustment: 0,
  },
  {
    id: "progressive",
    name: "Progressive",
    description: "Seamless multifocal lenses for distance, intermediate, and near vision",
    priceAdjustment: 80,
  },
  {
    id: "bifocal",
    name: "Bifocal",
    description: "Lenses with two distinct vision zones for distance and reading",
    priceAdjustment: 50,
  },
  {
    id: "high-index",
    name: "High Index",
    description: "Thinner, lighter lenses for stronger prescriptions",
    priceAdjustment: 60,
  },
  {
    id: "photochromic",
    name: "Photochromic",
    description: "Lenses that darken in sunlight and clear indoors",
    priceAdjustment: 70,
  },
  {
    id: "anti-reflective",
    name: "Anti-Reflective",
    description: "Coating that reduces glare and reflections",
    priceAdjustment: 30,
  },
];
