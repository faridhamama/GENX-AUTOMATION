export interface ContactPageHeroRow {
  id: number;
  label: string;
  headline: string;
  body: string;
  updated_at: string;
}

export interface ContactStatRow {
  id: string;
  sort_order: number;
  value: string;
  label: string;
  updated_at: string;
}

export interface ProjectTypeRow {
  id: string;
  sort_order: number;
  label: string;
  updated_at: string;
}

export interface ContactFormContentRow {
  id: number;
  form_title: string;
  success_title: string;
  success_body: string;
  error_message: string;
  footer_note: string;
  submit_label: string;
  loading_label: string;
  updated_at: string;
}

export interface FormLabelsRow {
  id: number;
  full_name_label: string;
  full_name_error: string;
  full_name_placeholder: string;
  phone_label: string;
  phone_error: string;
  phone_placeholder: string;
  email_label: string;
  email_error: string;
  email_placeholder: string;
  desired_date_label: string;
  desired_date_placeholder: string;
  project_type_label: string;
  description_label: string;
  description_error: string;
  description_placeholder: string;
  updated_at: string;
}
