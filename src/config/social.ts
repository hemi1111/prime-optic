export const SOCIAL_LINKS = {
  instagram: import.meta.env.VITE_INSTAGRAM_URL || "https://www.instagram.com",
  tiktok: import.meta.env.VITE_TIKTOK_URL || "https://www.tiktok.com",
  facebook: import.meta.env.VITE_FACEBOOK_URL || "https://www.facebook.com",
} as const;
