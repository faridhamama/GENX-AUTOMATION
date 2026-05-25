import { computed, inject, Injectable, signal } from '@angular/core';
import type {
  AboutHeroRow,
  AboutAvailabilityRow,
  AboutMissionRow,
  AboutCompanyRow,
  AboutServicesSectionRow,
  AboutValuesSectionRow,
  AboutCtaSectionRow,
  AboutImageRow,
} from './models/index';
import { AboutDbService } from './services/about-db.service';

@Injectable({ providedIn: 'root' })
export class AboutFacade {
  private readonly db = inject(AboutDbService);

  readonly aboutHero = signal<AboutHeroRow | null>(null);
  readonly aboutAvailability = signal<AboutAvailabilityRow | null>(null);
  readonly aboutMission = signal<AboutMissionRow | null>(null);
  readonly aboutCompany = signal<AboutCompanyRow | null>(null);
  readonly aboutServicesSection = signal<AboutServicesSectionRow | null>(null);
  readonly aboutValuesSection = signal<AboutValuesSectionRow | null>(null);
  readonly aboutCtaSection = signal<AboutCtaSectionRow | null>(null);
  readonly aboutImages = signal<AboutImageRow[]>([]);
  readonly aboutLoading = signal(false);

  readonly aboutImagesMap = computed(() => {
    const map: Record<string, { url: string; alt_text: string }> = {};
    for (const img of this.aboutImages()) {
      map[img.image_key] = { url: img.url, alt_text: img.alt_text };
    }
    return map;
  });

  async fetchAboutContent(): Promise<void> {
    this.aboutLoading.set(true);
    await Promise.all([
      this.fetchAboutHero(),
      this.fetchAboutAvailability(),
      this.fetchAboutMission(),
      this.fetchAboutCompany(),
      this.fetchAboutServicesSection(),
      this.fetchAboutValuesSection(),
      this.fetchAboutCtaSection(),
      this.fetchAboutImages(),
    ]);
    this.aboutLoading.set(false);
  }

  private async fetchAboutHero(): Promise<void> {
    const { data, error } = await this.db.getAboutHero();
    if (!error && data) this.aboutHero.set(data);
  }

  async updateAboutHero(hero: AboutHeroRow): Promise<{ error: string | null }> {
    const { error } = await this.db.upsertAboutHero(hero);
    if (!error) await this.fetchAboutHero();
    return { error };
  }

  private async fetchAboutAvailability(): Promise<void> {
    const { data, error } = await this.db.getAboutAvailability();
    if (!error && data) this.aboutAvailability.set(data);
  }

  async updateAboutAvailability(a: AboutAvailabilityRow): Promise<{ error: string | null }> {
    const { error } = await this.db.upsertAboutAvailability(a);
    if (!error) await this.fetchAboutAvailability();
    return { error };
  }

  private async fetchAboutMission(): Promise<void> {
    const { data, error } = await this.db.getAboutMission();
    if (!error && data) this.aboutMission.set(data);
  }

  async updateAboutMission(m: AboutMissionRow): Promise<{ error: string | null }> {
    const { error } = await this.db.upsertAboutMission(m);
    if (!error) await this.fetchAboutMission();
    return { error };
  }

  private async fetchAboutCompany(): Promise<void> {
    const { data, error } = await this.db.getAboutCompany();
    if (!error && data) this.aboutCompany.set(data);
  }

  async updateAboutCompany(c: AboutCompanyRow): Promise<{ error: string | null }> {
    const { error } = await this.db.upsertAboutCompany(c);
    if (!error) await this.fetchAboutCompany();
    return { error };
  }

  private async fetchAboutServicesSection(): Promise<void> {
    const { data, error } = await this.db.getAboutServicesSection();
    if (!error && data) this.aboutServicesSection.set(data);
  }

  async updateAboutServicesSection(s: AboutServicesSectionRow): Promise<{ error: string | null }> {
    const { error } = await this.db.upsertAboutServicesSection(s);
    if (!error) await this.fetchAboutServicesSection();
    return { error };
  }

  private async fetchAboutValuesSection(): Promise<void> {
    const { data, error } = await this.db.getAboutValuesSection();
    if (!error && data) this.aboutValuesSection.set(data);
  }

  async updateAboutValuesSection(v: AboutValuesSectionRow): Promise<{ error: string | null }> {
    const { error } = await this.db.upsertAboutValuesSection(v);
    if (!error) await this.fetchAboutValuesSection();
    return { error };
  }

  private async fetchAboutCtaSection(): Promise<void> {
    const { data, error } = await this.db.getAboutCtaSection();
    if (!error && data) this.aboutCtaSection.set(data);
  }

  async updateAboutCtaSection(c: AboutCtaSectionRow): Promise<{ error: string | null }> {
    const { error } = await this.db.upsertAboutCtaSection(c);
    if (!error) await this.fetchAboutCtaSection();
    return { error };
  }

  private async fetchAboutImages(): Promise<void> {
    const { data, error } = await this.db.getAboutImages();
    if (!error && data) this.aboutImages.set(data);
  }

  async restore(): Promise<void> {
    await Promise.all([
      this.fetchAboutHero(),
      this.fetchAboutAvailability(),
      this.fetchAboutMission(),
      this.fetchAboutCompany(),
      this.fetchAboutServicesSection(),
      this.fetchAboutValuesSection(),
      this.fetchAboutCtaSection(),
      this.fetchAboutImages(),
    ]);
  }

  async upsertAboutImage(key: string, url: string, alt: string): Promise<{ error: string | null }> {
    const { error } = await this.db.upsertAboutImage(key, url, alt);
    if (!error) await this.fetchAboutImages();
    return { error };
  }
}