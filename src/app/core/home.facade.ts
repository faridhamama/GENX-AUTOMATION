import { computed, inject, Injectable, signal } from '@angular/core';
import type { HomepageHeroStats, HomepageExpertiseCard, HomepageImage, HomepageHeroContentRow } from './models/index';
import { HomepageDbService } from './services/homepage-db.service';

@Injectable({ providedIn: 'root' })
export class HomeFacade {
  private readonly db = inject(HomepageDbService);

  readonly homepageHeroStats = signal<HomepageHeroStats | null>(null);
  readonly homepageExpertiseCards = signal<HomepageExpertiseCard[]>([]);
  readonly homepageImages = signal<HomepageImage[]>([]);
  readonly homepageHeroContent = signal<HomepageHeroContentRow | null>(null);
  readonly homepageLoading = signal(false);

  readonly homepageImagesMap = computed(() => {
    const map: Record<string, { url: string; alt_text: string }> = {};
    for (const img of this.homepageImages()) {
      map[img.image_key] = { url: img.url, alt_text: img.alt_text };
    }
    return map;
  });

  async fetchHomepageContent(): Promise<void> {
    this.homepageLoading.set(true);
    await Promise.all([
      this.fetchHomepageHeroStats(),
      this.fetchHomepageExpertiseCards(),
      this.fetchHomepageImages(),
    ]);
    this.homepageLoading.set(false);
  }

  async fetchHomepageHeroContent(): Promise<void> {
    const { data, error } = await this.db.getHomepageHeroContent();
    if (!error && data) this.homepageHeroContent.set(data);
  }

  private async fetchHomepageHeroStats(): Promise<void> {
    const { data, error } = await this.db.getHomepageHeroStats();
    if (!error && data) this.homepageHeroStats.set(data);
  }

  async updateHomepageHeroStats(stats: HomepageHeroStats): Promise<{ error: string | null }> {
    const { error } = await this.db.upsertHomepageHeroStats(stats);
    if (!error) await this.fetchHomepageHeroStats();
    return { error };
  }

  private async fetchHomepageExpertiseCards(): Promise<void> {
    const { data, error } = await this.db.getHomepageExpertiseCards();
    if (!error && data) this.homepageExpertiseCards.set(data);
  }

  async updateHomepageExpertiseCard(id: string, card: Partial<HomepageExpertiseCard>): Promise<{ error: string | null }> {
    const { error } = await this.db.upsertHomepageExpertiseCard(id, card);
    if (!error) await this.fetchHomepageExpertiseCards();
    return { error };
  }

  async deleteHomepageExpertiseCard(id: string): Promise<{ error: string | null }> {
    const { error } = await this.db.deleteHomepageExpertiseCard(id);
    if (!error) await this.fetchHomepageExpertiseCards();
    return { error };
  }

  private async fetchHomepageImages(): Promise<void> {
    const { data, error } = await this.db.getHomepageImages();
    if (!error && data) this.homepageImages.set(data);
  }

  async restore(): Promise<void> {
    await Promise.all([
      this.fetchHomepageHeroStats(),
      this.fetchHomepageExpertiseCards(),
      this.fetchHomepageImages(),
      this.fetchHomepageHeroContent(),
    ]);
  }

  async upsertHomepageImage(key: string, url: string, alt: string): Promise<{ error: string | null }> {
    const { error } = await this.db.upsertHomepageImage(key, url, alt);
    if (!error) await this.fetchHomepageImages();
    return { error };
  }

  async updateHomepageHeroContent(content: HomepageHeroContentRow): Promise<{ error: string | null }> {
    const { error } = await this.db.upsertHomepageHeroContent(content);
    if (!error) await this.fetchHomepageHeroContent();
    return { error };
  }
}