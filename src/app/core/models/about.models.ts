export interface AboutHeroRow {
  id: number;
  label: string;
  headline: string;
  body: string;
  updated_at: string;
}

export interface AboutAvailabilityRow {
  id: number;
  label: string;
  days: string;
  hours: string;
  updated_at: string;
}

export interface AboutMissionRow {
  id: number;
  label: string;
  quote: string;
  updated_at: string;
}

export interface AboutCompanyRow {
  id: number;
  label: string;
  body: string;
  updated_at: string;
}

export interface AboutServicesSectionRow {
  id: number;
  headline: string;
  subtext: string;
  updated_at: string;
}

export interface AboutValuesSectionRow {
  id: number;
  headline: string;
  subtext: string;
  updated_at: string;
}

export interface AboutCtaSectionRow {
  id: number;
  headline: string;
  subtext: string;
  cta_primary_label: string;
  cta_primary_link: string;
  cta_secondary_label: string;
  cta_secondary_link: string;
  updated_at: string;
}

export interface AboutImageRow {
  image_key: string;
  url: string;
  alt_text: string;
  updated_at: string;
}
