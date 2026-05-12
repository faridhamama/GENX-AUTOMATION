export interface ServicesPageHeroRow {
  id: number;
  label: string;
  headline: string;
  body: string;
  updated_at: string;
}

export interface ServicesMethodologyRow {
  id: number;
  section_label: string;
  headline: string;
  subtext: string;
  updated_at: string;
}

export interface MethodologyStepRow {
  id: string;
  sort_order: number;
  step_number: number;
  title: string;
  description: string;
  updated_at: string;
}

export interface ServicesImageRow {
  image_key: string;
  url: string;
  alt_text: string;
  updated_at: string;
}
