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
  source: "Google";
  rating: number;
  order: number;
  active: boolean;
}

export interface UnitSectionContent {
  title: string;
  description: string;
  address: string;
  media: SiteMediaCard[];
}
