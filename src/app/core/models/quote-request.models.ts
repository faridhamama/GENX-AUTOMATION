export interface QuoteRequest {
  full_name: string;
  phone: string;
  email: string;
  desired_date: string | null;
  project_type: string;
  description: string;
}

export interface QuoteRequestRow extends QuoteRequest {
  id: string;
  read: boolean;
  created_at: string;
}
