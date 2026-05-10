import { inject, Injectable, signal } from '@angular/core';
import { SupabaseService } from './supabase.service';

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

@Injectable({ providedIn: 'root' })
export class CompanyInfoService {
  private readonly supabase = inject(SupabaseService);

  // Company info
  readonly companyInfo = signal<CompanyInfo | null>(null);
  readonly isLoading = signal(false);

  // Services
  readonly services = signal<Service[]>([]);
  readonly servicesLoading = signal(false);

  // Company values
  readonly companyValues = signal<CompanyValue[]>([]);
  readonly valuesLoading = signal(false);

  // --- Company Info ---
  async fetchCompanyInfo(): Promise<void> {
    this.isLoading.set(true);
    const { data, error } = await this.supabase.getCompanyInfo();
    if (!error && data) {
      this.companyInfo.set(data);
    }
    this.isLoading.set(false);
  }

  async updateCompanyInfo(info: Partial<CompanyInfo>): Promise<{ error: string | null }> {
    const { error } = await this.supabase.updateCompanyInfo(info);
    if (!error) {
      await this.fetchCompanyInfo();
    }
    return { error };
  }

  // --- Services ---
  async fetchServices(): Promise<void> {
    this.servicesLoading.set(true);
    const { data, error } = await this.supabase.getServices();
    if (!error && data) {
      this.services.set(data);
    }
    this.servicesLoading.set(false);
  }

  async createService(label: string, description: string): Promise<{ error: string | null }> {
    const maxOrder = this.services().reduce((max, s) => Math.max(max, s.sort_order), 0);
    const { error } = await this.supabase.createService(label, description, maxOrder + 1);
    if (!error) {
      await this.fetchServices();
    }
    return { error };
  }

  async updateService(id: string, label: string, description: string): Promise<{ error: string | null }> {
    const { error } = await this.supabase.updateService(id, label, description);
    if (!error) {
      await this.fetchServices();
    }
    return { error };
  }

  async deleteService(id: string): Promise<{ error: string | null }> {
    const { error } = await this.supabase.deleteService(id);
    if (!error) {
      await this.fetchServices();
    }
    return { error };
  }

  async reorderServices(orderedIds: string[]): Promise<{ error: string | null }> {
    const updates = orderedIds.map((id, index) =>
      this.supabase.updateServiceOrder(id, index + 1),
    );
    const results = await Promise.all(updates);
    const error = results.find((r) => r.error)?.error ?? null;
    if (!error) {
      await this.fetchServices();
    }
    return { error };
  }

  // --- Company Values ---
  async fetchCompanyValues(): Promise<void> {
    this.valuesLoading.set(true);
    const { data, error } = await this.supabase.getCompanyValues();
    if (!error && data) {
      this.companyValues.set(data);
    }
    this.valuesLoading.set(false);
  }

  async updateCompanyValue(id: string, icon: string, title: string, description: string): Promise<{ error: string | null }> {
    const { error } = await this.supabase.updateCompanyValue(id, { icon, title, description });
    if (!error) {
      await this.fetchCompanyValues();
    }
    return { error };
  }
}