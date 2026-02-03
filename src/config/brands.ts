export type Brand = {
  slug: string;
  name: string;
};

export const FEATURED_BRANDS: Brand[] = [
  { slug: "ray-ban", name: "Ray-Ban" },
  { slug: "police", name: "Police" },
  { slug: "tom-ford", name: "Tom Ford" },
  { slug: "gucci", name: "Gucci" },
  { slug: "chanel", name: "Chanel" },
  { slug: "cartier", name: "Cartier" },
  { slug: "prada", name: "Prada" },
  { slug: "tommy-hilfiger", name: "Tommy Hilfiger" },
];

export function getBrandBySlug(slug: string): Brand | undefined {
  return FEATURED_BRANDS.find((b) => b.slug === slug.toLowerCase());
}

export function getBrandNameBySlug(slug: string): string | null {
  const brand = getBrandBySlug(slug);
  return brand ? brand.name : null;
}
