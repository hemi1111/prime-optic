export type Brand = {
  slug: string;
  name: string;
  image: string
};

export const FEATURED_BRANDS: Brand[] = [
  { slug: "ray-ban", name: "Ray-Ban", image: "https://vgtfcayksprxvzdcikrx.supabase.co/storage/v1/object/public/prime-optic/ray-ban-logo.png" },
  { slug: "police", name: "Police", image: "https://vgtfcayksprxvzdcikrx.supabase.co/storage/v1/object/public/prime-optic/police-logo.png" },
  { slug: "tom-ford", name: "Tom Ford", image: "https://vgtfcayksprxvzdcikrx.supabase.co/storage/v1/object/public/prime-optic/tom-ford-logo.png" },
  { slug: "gucci", name: "Gucci", image: "https://vgtfcayksprxvzdcikrx.supabase.co/storage/v1/object/public/prime-optic/gucci-logo.png" },
  { slug: "chanel", name: "Chanel", image: "https://vgtfcayksprxvzdcikrx.supabase.co/storage/v1/object/public/prime-optic/chanel-logo.png" },
  { slug: "cartier", name: "Cartier", image: "https://vgtfcayksprxvzdcikrx.supabase.co/storage/v1/object/public/prime-optic/cartier-logo.png" },
  { slug: "prada", name: "Prada", image: "https://vgtfcayksprxvzdcikrx.supabase.co/storage/v1/object/public/prime-optic/prada-logo.png" },
  { slug: "tommy-hilfiger", name: "Tommy Hilfiger", image: "https://vgtfcayksprxvzdcikrx.supabase.co/storage/v1/object/public/prime-optic/tommy-logo.png" },
];

export function getBrandBySlug(slug: string): Brand | undefined {
  return FEATURED_BRANDS.find((b) => b.slug === slug.toLowerCase());
}

export function getBrandNameBySlug(slug: string): string | null {
  const brand = getBrandBySlug(slug);
  return brand ? brand.name : null;
}
