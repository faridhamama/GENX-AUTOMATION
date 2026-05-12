import { Injectable } from '@angular/core';
import { inject } from '@angular/core';

import type {
  ReferencesHeroRow,
  ReferencesFeaturedProjectRow,
  ReferencesPerformanceStatRow,
  ReferencesSideProjectRow,
  ReferencesQualityPointRow,
  ReferencesImageRow,
} from '../models/index';
import { SupabaseService } from '../supabase.service';

@Injectable({ providedIn: 'root' })
export class ReferencesDbService {
  private readonly supabase = inject(SupabaseService);

  async getReferencesHero(): Promise<{ data: ReferencesHeroRow | null; error: string | null }> {
    const { data, error } = await this.supabase.client
      .from('references_hero')
      .select('*')
      .eq('id', 1)
      .maybeSingle();
    return { data: data as ReferencesHeroRow ?? null, error: error ? error.message : null };
  }

  async upsertReferencesHero(hero: ReferencesHeroRow): Promise<{ error: string | null }> {
    const { error } = await this.supabase.client
      .from('references_hero')
      .upsert({ ...hero, id: 1, updated_at: new Date().toISOString() })
      .eq('id', 1);
    return { error: error ? error.message : null };
  }

  async getReferencesFeaturedProject(): Promise<{ data: ReferencesFeaturedProjectRow | null; error: string | null }> {
    const { data, error } = await this.supabase.client
      .from('references_featured_project')
      .select('*')
      .eq('id', 1)
      .maybeSingle();
    return { data: data as ReferencesFeaturedProjectRow ?? null, error: error ? error.message : null };
  }

  async upsertReferencesFeaturedProject(project: ReferencesFeaturedProjectRow): Promise<{ error: string | null }> {
    const { error } = await this.supabase.client
      .from('references_featured_project')
      .upsert({ ...project, id: 1, updated_at: new Date().toISOString() })
      .eq('id', 1);
    return { error: error ? error.message : null };
  }

  async getReferencesPerformanceStats(): Promise<{ data: ReferencesPerformanceStatRow[]; error: string | null }> {
    const { data, error } = await this.supabase.client
      .from('references_performance_stats')
      .select('*')
      .order('sort_order', { ascending: true });
    return { data: (data as ReferencesPerformanceStatRow[]) ?? [], error: error ? error.message : null };
  }

  async upsertReferencesPerformanceStat(stat: Partial<ReferencesPerformanceStatRow> & { id: string }): Promise<{ error: string | null }> {
    const { error } = await this.supabase.client
      .from('references_performance_stats')
      .update({ ...stat, updated_at: new Date().toISOString() })
      .eq('id', stat.id);
    return { error: error ? error.message : null };
  }

  async getReferencesSideProjects(): Promise<{ data: ReferencesSideProjectRow[]; error: string | null }> {
    const { data, error } = await this.supabase.client
      .from('references_side_projects')
      .select('*')
      .order('sort_order', { ascending: true });
    return { data: (data as ReferencesSideProjectRow[]) ?? [], error: error ? error.message : null };
  }

  async upsertReferencesSideProject(id: string, project: Partial<ReferencesSideProjectRow>): Promise<{ error: string | null }> {
    const { error } = await this.supabase.client
      .from('references_side_projects')
      .update({ ...project, updated_at: new Date().toISOString() })
      .eq('id', id);
    return { error: error ? error.message : null };
  }

  async deleteReferencesSideProject(id: string): Promise<{ error: string | null }> {
    const { error } = await this.supabase.client
      .from('references_side_projects')
      .delete()
      .eq('id', id);
    return { error: error ? error.message : null };
  }

  async deleteReferencesQualityPoint(id: string): Promise<{ error: string | null }> {
    const { error } = await this.supabase.client
      .from('references_quality_points')
      .delete()
      .eq('id', id);
    return { error: error ? error.message : null };
  }

  async getReferencesQualityPoints(): Promise<{ data: ReferencesQualityPointRow[]; error: string | null }> {
    const { data, error } = await this.supabase.client
      .from('references_quality_points')
      .select('*')
      .order('sort_order', { ascending: true });
    return { data: (data as ReferencesQualityPointRow[]) ?? [], error: error ? error.message : null };
  }

  async upsertReferencesQualityPoint(id: string, point: Partial<ReferencesQualityPointRow>): Promise<{ error: string | null }> {
    const { error } = await this.supabase.client
      .from('references_quality_points')
      .update({ ...point, updated_at: new Date().toISOString() })
      .eq('id', id);
    return { error: error ? error.message : null };
  }

  async getReferencesImages(): Promise<{ data: ReferencesImageRow[]; error: string | null }> {
    const { data, error } = await this.supabase.client
      .from('references_images')
      .select('*');
    return { data: (data as ReferencesImageRow[]) ?? [], error: error ? error.message : null };
  }

  async upsertReferencesImage(imageKey: string, url: string, altText: string): Promise<{ error: string | null }> {
    const { error } = await this.supabase.client
      .from('references_images')
      .upsert({ image_key: imageKey, url, alt_text: altText, updated_at: new Date().toISOString() });
    return { error: error ? error.message : null };
  }
}