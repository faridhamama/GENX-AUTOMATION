export interface CompanyInfo {
  id: number;
  company_name: string;
  tagline: string;
  label: string;
  availability_hours: string;
  availability_days: string;
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  mission_quote: string;
  founded: number | null;
  domain: string | null;
  updated_at: string;
}

export interface Service {
  id: string;
  sort_order: number;
  label: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface CompanyValue {
  id: string;
  sort_order: number;
  icon: string;
  title: string;
  description: string;
  updated_at: string;
}
