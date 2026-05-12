// Homepage hero stats — the two stat boxes shown on the homepage
export interface HomepageHeroStatsRow {
  id: number;
  stat1_label: string;
  stat1_value: string;
  stat1_sub: string;
  stat1_accent_class: string;
  stat2_label: string;
  stat2_value: string;
  stat2_sub: string;
  stat2_accent_class: string;
  updated_at: string;
}

// Domain alias — used throughout the app instead of the Row suffix
export type HomepageHeroStats = HomepageHeroStatsRow;

// Individual expertise card in the homepage grid
export interface HomepageExpertiseCardRow {
  id: string;
  sort_order: number;
  icon: string;
  title: string;
  description: string;
  tags: string[];
  updated_at: string;
}

// Domain alias
export type HomepageExpertiseCard = HomepageExpertiseCardRow;

// Homepage images (hero background, circuit board, etc.)
export interface HomepageImageRow {
  image_key: string;
  url: string;
  alt_text: string;
  updated_at: string;
}

// Domain alias
export type HomepageImage = HomepageImageRow;

// Homepage hero section (badge, headline, body, CTAs, expertise section, CTA section)
export interface HomepageHeroContentRow {
  id: number;
  hero_badge: string;
  hero_headline: string;
  hero_body: string;
  cta_primary_label: string;
  cta_secondary_label: string;
  stats_image_caption: string;
  expertise_label: string;
  expertise_headline: string;
  expertise_subtext: string;
  cta_section_headline: string;
  cta_section_body: string;
  cta_section_label: string;
  updated_at: string;
}