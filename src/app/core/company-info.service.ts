import { computed, inject, Injectable, signal } from '@angular/core';
import { SupabaseService } from './supabase.service';
import type {
  ReferencesHeroRow,
  ReferencesFeaturedProjectRow,
  ReferencesPerformanceStatRow,
  ReferencesSideProjectRow,
  ReferencesQualityPointRow,
  ReferencesImageRow,
  ServicesPageHeroRow,
  ServicesMethodologyRow,
  MethodologyStepRow,
  ServicesImageRow,
} from './supabase.service';

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
    for (let i = 0; i < orderedIds.length; i++) {
      const { error } = await this.supabase.updateService(orderedIds[i], '', '');
      if (error) return { error };
    }
    await this.fetchServices();
    return { error: null };
  }

  async swapServiceOrder(id1: string, id2: string): Promise<{ error: string | null }> {
    const { error } = await this.supabase.swapServiceOrder(id1, id2);
    if (!error) await this.fetchServices();
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

  // --- References ---
  readonly referencesHero = signal<ReferencesHeroRow | null>(null);
  readonly referencesFeaturedProject = signal<ReferencesFeaturedProjectRow | null>(null);
  readonly referencesPerformanceStats = signal<ReferencesPerformanceStatRow[]>([]);
  readonly referencesSideProjects = signal<ReferencesSideProjectRow[]>([]);
  readonly referencesQualityPoints = signal<ReferencesQualityPointRow[]>([]);
  readonly referencesImages = signal<ReferencesImageRow[]>([]);
  readonly referencesLoading = signal(false);

  readonly referencesImagesMap = computed(() => {
    const map: Record<string, { url: string; alt_text: string }> = {};
    for (const img of this.referencesImages()) {
      map[img.image_key] = { url: img.url, alt_text: img.alt_text };
    }
    return map;
  });

  async fetchReferencesContent(): Promise<void> {
    this.referencesLoading.set(true);
    await Promise.all([
      this.fetchReferencesHero(),
      this.fetchReferencesFeaturedProject(),
      this.fetchReferencesPerformanceStats(),
      this.fetchReferencesSideProjects(),
      this.fetchReferencesQualityPoints(),
      this.fetchReferencesImages(),
    ]);
    this.referencesLoading.set(false);
  }

  private async fetchReferencesHero(): Promise<void> {
    const { data, error } = await this.supabase.getReferencesHero();
    if (!error && data) this.referencesHero.set(data);
  }

  async updateReferencesHero(hero: ReferencesHeroRow): Promise<{ error: string | null }> {
    const { error } = await this.supabase.upsertReferencesHero(hero);
    if (!error) await this.fetchReferencesHero();
    return { error };
  }

  private async fetchReferencesFeaturedProject(): Promise<void> {
    const { data, error } = await this.supabase.getReferencesFeaturedProject();
    if (!error && data) this.referencesFeaturedProject.set(data);
  }

  async updateReferencesFeaturedProject(project: ReferencesFeaturedProjectRow): Promise<{ error: string | null }> {
    const { error } = await this.supabase.upsertReferencesFeaturedProject(project);
    if (!error) await this.fetchReferencesFeaturedProject();
    return { error };
  }

  private async fetchReferencesPerformanceStats(): Promise<void> {
    const { data, error } = await this.supabase.getReferencesPerformanceStats();
    if (!error && data) this.referencesPerformanceStats.set(data as ReferencesPerformanceStatRow[]);
  }

  async updateReferencesPerformanceStat(stat: Partial<ReferencesPerformanceStatRow> & { id: string }): Promise<{ error: string | null }> {
    const { error } = await this.supabase.upsertReferencesPerformanceStat(stat);
    if (!error) await this.fetchReferencesPerformanceStats();
    return { error };
  }

  private async fetchReferencesSideProjects(): Promise<void> {
    const { data, error } = await this.supabase.getReferencesSideProjects();
    if (!error && data) this.referencesSideProjects.set(data as ReferencesSideProjectRow[]);
  }

  async updateReferencesSideProject(id: string, project: Partial<ReferencesSideProjectRow>): Promise<{ error: string | null }> {
    const { error } = await this.supabase.upsertReferencesSideProject(id, project);
    if (!error) await this.fetchReferencesSideProjects();
    return { error };
  }

  async deleteReferencesSideProject(id: string): Promise<{ error: string | null }> {
    const { error } = await this.supabase.deleteReferencesSideProject(id);
    if (!error) await this.fetchReferencesSideProjects();
    return { error };
  }

  private async fetchReferencesQualityPoints(): Promise<void> {
    const { data, error } = await this.supabase.getReferencesQualityPoints();
    if (!error && data) this.referencesQualityPoints.set(data as ReferencesQualityPointRow[]);
  }

  async updateReferencesQualityPoint(id: string, point: Partial<ReferencesQualityPointRow>): Promise<{ error: string | null }> {
    const { error } = await this.supabase.upsertReferencesQualityPoint(id, point);
    if (!error) await this.fetchReferencesQualityPoints();
    return { error };
  }

  private async fetchReferencesImages(): Promise<void> {
    const { data, error } = await this.supabase.getReferencesImages();
    if (!error && data) this.referencesImages.set(data as ReferencesImageRow[]);
  }

  async upsertReferencesImage(key: string, url: string, alt: string): Promise<{ error: string | null }> {
    const { error } = await this.supabase.upsertReferencesImage(key, url, alt);
    if (!error) await this.fetchReferencesImages();
    return { error };
  }

  // --- Services ---
  readonly servicesPageHero = signal<ServicesPageHeroRow | null>(null);
  readonly servicesMethodology = signal<ServicesMethodologyRow | null>(null);
  readonly methodologySteps = signal<MethodologyStepRow[]>([]);
  readonly servicesImages = signal<ServicesImageRow[]>([]);
  readonly servicesImagesMap = computed(() => {
    const map: Record<string, { url: string; alt_text: string }> = {};
    for (const img of this.servicesImages()) {
      map[img.image_key] = { url: img.url, alt_text: img.alt_text };
    }
    return map;
  });

  async fetchServicesContent(): Promise<void> {
    await Promise.all([
      this.fetchServicesPageHero(),
      this.fetchServicesMethodology(),
      this.fetchMethodologySteps(),
      this.fetchServicesImages(),
    ]);
  }

  private async fetchServicesPageHero(): Promise<void> {
    const { data, error } = await this.supabase.getServicesPageHero();
    if (!error && data) this.servicesPageHero.set(data);
  }

  async updateServicesPageHero(hero: ServicesPageHeroRow): Promise<{ error: string | null }> {
    const { error } = await this.supabase.upsertServicesPageHero(hero);
    if (!error) await this.fetchServicesPageHero();
    return { error };
  }

  private async fetchServicesMethodology(): Promise<void> {
    const { data, error } = await this.supabase.getServicesMethodology();
    if (!error && data) this.servicesMethodology.set(data);
  }

  async updateServicesMethodology(methodology: ServicesMethodologyRow): Promise<{ error: string | null }> {
    const { error } = await this.supabase.upsertServicesMethodology(methodology);
    if (!error) await this.fetchServicesMethodology();
    return { error };
  }

  private async fetchMethodologySteps(): Promise<void> {
    const { data, error } = await this.supabase.getMethodologySteps();
    if (!error && data) this.methodologySteps.set(data as MethodologyStepRow[]);
  }

  async updateMethodologyStep(id: string, step: Partial<MethodologyStepRow>): Promise<{ error: string | null }> {
    const { error } = await this.supabase.upsertMethodologyStep(id, step);
    if (!error) await this.fetchMethodologySteps();
    return { error };
  }

  private async fetchServicesImages(): Promise<void> {
    const { data, error } = await this.supabase.getServicesImages();
    if (!error && data) this.servicesImages.set(data as ServicesImageRow[]);
  }

  async upsertServicesImage(key: string, url: string, alt: string): Promise<{ error: string | null }> {
    const { error } = await this.supabase.upsertServicesImage(key, url, alt);
    if (!error) await this.fetchServicesImages();
    return { error };
  }
}