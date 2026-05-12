export interface ReferencesHeroRow {
  id: number;
  label: string;
  headline: string;
  body: string;
  updated_at: string;
}

export interface ReferencesFeaturedProjectRow {
  id: number;
  sector: string;
  title: string;
  technology: string;
  tech_label: string;
  specs_json: string;
  image_key: string;
  image_alt: string;
  result: string;
  updated_at: string;
}

export interface ReferencesPerformanceStatRow {
  id: string;
  sort_order: number;
  value: string;
  label: string;
  updated_at: string;
}

export interface ReferencesSideProjectRow {
  id: string;
  sort_order: number;
  sector: string;
  title: string;
  description: string;
  key_spec: string;
  updated_at: string;
}

export interface ReferencesQualityPointRow {
  id: string;
  sort_order: number;
  icon: string;
  title: string;
  description: string;
  updated_at: string;
}

export interface ReferencesImageRow {
  image_key: string;
  url: string;
  alt_text: string;
  updated_at: string;
}
