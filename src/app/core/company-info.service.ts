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

export interface HomepageHeroStats {
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

export interface HomepageExpertiseCard {
  id: string;
  sort_order: number;
  icon: string;
  title: string;
  description: string;
  tags: string[];
  updated_at: string;
}

export interface HomepageImage {
  image_key: string;
  url: string;
  alt_text: string;
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

  // Homepage
  readonly homepageHeroStats = signal<HomepageHeroStats | null>(null);
  readonly homepageExpertiseCards = signal<HomepageExpertiseCard[]>([]);
  readonly homepageImages = signal<HomepageImage[]>([]);
  readonly homepageLoading = signal(false);

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

  // --- Homepage ---
  async fetchHomepageContent(): Promise<void> {
    this.homepageLoading.set(true);
    await Promise.all([
      this.fetchHomepageHeroStats(),
      this.fetchHomepageExpertiseCards(),
      this.fetchHomepageImages(),
    ]);
    this.homepageLoading.set(false);
  }

  private async fetchHomepageHeroStats(): Promise<void> {
    const { data, error } = await this.supabase.getHomepageHeroStats();
    if (!error && data) {
      this.homepageHeroStats.set(data as HomepageHeroStats);
    }
  }

  async updateHomepageHeroStats(stats: HomepageHeroStats): Promise<{ error: string | null }> {
    const { error } = await this.supabase.upsertHomepageHeroStats(stats);
    if (!error) {
      await this.fetchHomepageHeroStats();
    }
    return { error };
  }

  private async fetchHomepageExpertiseCards(): Promise<void> {
    const { data, error } = await this.supabase.getHomepageExpertiseCards();
    if (!error && data) {
      this.homepageExpertiseCards.set(data as HomepageExpertiseCard[]);
    }
  }

  async updateHomepageExpertiseCard(id: string, card: Partial<HomepageExpertiseCard>): Promise<{ error: string | null }> {
    const { error } = await this.supabase.upsertHomepageExpertiseCard(id, card);
    if (!error) {
      await this.fetchHomepageExpertiseCards();
    }
    return { error };
  }

  async deleteHomepageExpertiseCard(id: string): Promise<{ error: string | null }> {
    const { error } = await this.supabase.deleteHomepageExpertiseCard(id);
    if (!error) {
      await this.fetchHomepageExpertiseCards();
    }
    return { error };
  }

  private async fetchHomepageImages(): Promise<void> {
    const { data, error } = await this.supabase.getHomepageImages();
    if (!error && data) {
      this.homepageImages.set(data as HomepageImage[]);
    }
  }

  async upsertHomepageImage(key: string, url: string, alt: string): Promise<{ error: string | null }> {
    const { error } = await this.supabase.upsertHomepageImage(key, url, alt);
    if (!error) {
      await this.fetchHomepageImages();
    }
    return { error };
  }
}