import { computed, inject, Injectable, signal } from '@angular/core';
import type {
  ServicesPageHeroRow,
  ServicesMethodologyRow,
  MethodologyStepRow,
  ServicesImageRow,
} from './models/index';
import { ServicesPageDbService } from './services/services-page-db.service';

@Injectable({ providedIn: 'root' })
export class ServicesPageFacade {
  private readonly db = inject(ServicesPageDbService);

  readonly servicesPageHero = signal<ServicesPageHeroRow | null>(null);
  readonly servicesMethodology = signal<ServicesMethodologyRow | null>(null);
  readonly methodologySteps = signal<MethodologyStepRow[]>([]);
  readonly servicesImages = signal<ServicesImageRow[]>([]);
  readonly servicesLoading = signal(false);

  readonly servicesImagesMap = computed(() => {
    const map: Record<string, { url: string; alt_text: string }> = {};
    for (const img of this.servicesImages()) {
      map[img.image_key] = { url: img.url, alt_text: img.alt_text };
    }
    return map;
  });

  async fetchServicesContent(): Promise<void> {
    this.servicesLoading.set(true);
    await Promise.all([
      this.fetchServicesPageHero(),
      this.fetchServicesMethodology(),
      this.fetchMethodologySteps(),
      this.fetchServicesImages(),
    ]);
    this.servicesLoading.set(false);
  }

  private async fetchServicesPageHero(): Promise<void> {
    const { data, error } = await this.db.getServicesPageHero();
    if (!error && data) this.servicesPageHero.set(data);
  }

  async updateServicesPageHero(hero: ServicesPageHeroRow): Promise<{ error: string | null }> {
    const { error } = await this.db.upsertServicesPageHero(hero);
    if (!error) await this.fetchServicesPageHero();
    return { error };
  }

  private async fetchServicesMethodology(): Promise<void> {
    const { data, error } = await this.db.getServicesMethodology();
    if (!error && data) this.servicesMethodology.set(data);
  }

  async updateServicesMethodology(m: ServicesMethodologyRow): Promise<{ error: string | null }> {
    const { error } = await this.db.upsertServicesMethodology(m);
    if (!error) await this.fetchServicesMethodology();
    return { error };
  }

  private async fetchMethodologySteps(): Promise<void> {
    const { data, error } = await this.db.getMethodologySteps();
    if (!error && data) this.methodologySteps.set(data);
  }

  async updateMethodologyStep(id: string, step: Partial<MethodologyStepRow>): Promise<{ error: string | null }> {
    const { error } = await this.db.upsertMethodologyStep(id, step);
    if (!error) await this.fetchMethodologySteps();
    return { error };
  }

  private async fetchServicesImages(): Promise<void> {
    const { data, error } = await this.db.getServicesImages();
    if (!error && data) this.servicesImages.set(data);
  }

  async restore(): Promise<void> {
    await Promise.all([
      this.fetchServicesPageHero(),
      this.fetchServicesMethodology(),
      this.fetchMethodologySteps(),
      this.fetchServicesImages(),
    ]);
  }

  async upsertServicesImage(key: string, url: string, alt: string): Promise<{ error: string | null }> {
    const { error } = await this.db.upsertServicesImage(key, url, alt);
    if (!error) await this.fetchServicesImages();
    return { error };
  }
}