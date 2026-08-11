export interface SiteMediaCard {
  id: string;
  section: "unit";
  title?: string;
  imageUrl: string;
  alt: string;
  position: "primary" | "secondary" | "complementary";
  order: number;
  active: boolean;
}

export interface SiteTestimonial {
  id: string;
  name: string;
  quote: string;
  source: string;
  rating: number;
  avatarUrl?: string | undefined;
  order: number;
  active: boolean;
}

export type SiteMediaInput = Pick<SiteMediaCard, "alt" | "position" | "order"> & { title?: string };
export type SiteTestimonialInput = Omit<SiteTestimonial, "id" | "avatarUrl">;
export type UnitSectionInput = Omit<UnitSectionContent, "media">;
export interface OrderItem {
  id: string;
  order: number;
}

export interface UnitSectionContent {
  title: string;
  description: string;
  address: string;
  media: SiteMediaCard[];
}
