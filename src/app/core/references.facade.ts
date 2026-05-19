import { computed, inject, Injectable, signal } from '@angular/core';
import type {
  ReferencesHeroRow,
  ReferencesFeaturedProjectRow,
  ReferencesPerformanceStatRow,
  ReferencesSideProjectRow,
  ReferencesQualityPointRow,
  ReferencesImageRow,
} from './models/index';
import { ReferencesDbService } from './services/references-db.service';

@Injectable({ providedIn: 'root' })
export class ReferencesFacade {
  private readonly db = inject(ReferencesDbService);

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
    const { data, error } = await this.db.getReferencesHero();
    if (!error && data) this.referencesHero.set(data);
  }

  async updateReferencesHero(hero: ReferencesHeroRow): Promise<{ error: string | null }> {
    const { error } = await this.db.upsertReferencesHero(hero);
    if (!error) await this.fetchReferencesHero();
    return { error };
  }

  private async fetchReferencesFeaturedProject(): Promise<void> {
    const { data, error } = await this.db.getReferencesFeaturedProject();
    if (!error && data) this.referencesFeaturedProject.set(data);
  }

  async updateReferencesFeaturedProject(project: ReferencesFeaturedProjectRow): Promise<{ error: string | null }> {
    const { error } = await this.db.upsertReferencesFeaturedProject(project);
    if (!error) await this.fetchReferencesFeaturedProject();
    return { error };
  }

  private async fetchReferencesPerformanceStats(): Promise<void> {
    const { data, error } = await this.db.getReferencesPerformanceStats();
    if (!error && data) this.referencesPerformanceStats.set(data);
  }

  async updateReferencesPerformanceStat(stat: Partial<ReferencesPerformanceStatRow> & { id: string }): Promise<{ error: string | null }> {
    const { error } = await this.db.upsertReferencesPerformanceStat(stat);
    if (!error) await this.fetchReferencesPerformanceStats();
    return { error };
  }

  private async fetchReferencesSideProjects(): Promise<void> {
    const { data, error } = await this.db.getReferencesSideProjects();
    if (!error && data) this.referencesSideProjects.set(data);
  }

  async updateReferencesSideProject(id: string, project: Partial<ReferencesSideProjectRow>): Promise<{ error: string | null }> {
    const { error } = await this.db.upsertReferencesSideProject(id, project);
    if (!error) await this.fetchReferencesSideProjects();
    return { error };
  }

  async createReferencesSideProject(project: Omit<ReferencesSideProjectRow, 'updated_at'>): Promise<{ error: string | null }> {
    const { error } = await this.db.insertReferencesSideProject(project);
    if (!error) await this.fetchReferencesSideProjects();
    return { error };
  }

  async deleteReferencesSideProject(id: string): Promise<{ error: string | null }> {
    const { error } = await this.db.deleteReferencesSideProject(id);
    if (!error) await this.fetchReferencesSideProjects();
    return { error };
  }

  async deleteReferencesQualityPoint(id: string): Promise<{ error: string | null }> {
    const { error } = await this.db.deleteReferencesQualityPoint(id);
    if (!error) await this.fetchReferencesQualityPoints();
    return { error };
  }

  private async fetchReferencesQualityPoints(): Promise<void> {
    const { data, error } = await this.db.getReferencesQualityPoints();
    if (!error && data) this.referencesQualityPoints.set(data);
  }

  async updateReferencesQualityPoint(id: string, point: Partial<ReferencesQualityPointRow>): Promise<{ error: string | null }> {
    const { error } = await this.db.upsertReferencesQualityPoint(id, point);
    if (!error) await this.fetchReferencesQualityPoints();
    return { error };
  }

  async createReferencesQualityPoint(point: Omit<ReferencesQualityPointRow, 'updated_at'>): Promise<{ error: string | null }> {
    const { error } = await this.db.insertReferencesQualityPoint(point);
    if (!error) await this.fetchReferencesQualityPoints();
    return { error };
  }

  private async fetchReferencesImages(): Promise<void> {
    const { data, error } = await this.db.getReferencesImages();
    if (!error && data) this.referencesImages.set(data);
  }

  async upsertReferencesImage(key: string, url: string, alt: string): Promise<{ error: string | null }> {
    const { error } = await this.db.upsertReferencesImage(key, url, alt);
    if (!error) await this.fetchReferencesImages();
    return { error };
  }
}