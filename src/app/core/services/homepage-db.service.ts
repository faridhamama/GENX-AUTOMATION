import { Injectable } from '@angular/core';
import { inject } from '@angular/core';

import type { HomepageHeroStatsRow, HomepageExpertiseCardRow, HomepageImageRow, HomepageHeroContentRow } from '../models/index';
import { SupabaseService } from '../supabase.service';

@Injectable({ providedIn: 'root' })
export class HomepageDbService {
  private readonly supabase = inject(SupabaseService);

  async getHomepageHeroStats(): Promise<{ data: HomepageHeroStatsRow | null; error: string | null }> {
    const { data, error } = await this.supabase.client
      .from('homepage_hero_stats')
      .select('*')
      .eq('id', 1)
      .maybeSingle();
    return { data: data as HomepageHeroStatsRow ?? null, error: error ? error.message : null };
  }

  async upsertHomepageHeroStats(stats: HomepageHeroStatsRow): Promise<{ error: string | null }> {
    const { error } = await this.supabase.client
      .from('homepage_hero_stats')
      .upsert({ ...stats, id: 1, updated_at: new Date().toISOString() })
      .eq('id', 1);
    return { error: error ? error.message : null };
  }

  async getHomepageExpertiseCards(): Promise<{ data: HomepageExpertiseCardRow[]; error: string | null }> {
    const { data, error } = await this.supabase.client
      .from('homepage_expertise_cards')
      .select('*')
      .order('sort_order', { ascending: true });
    return { data: (data as HomepageExpertiseCardRow[]) ?? [], error: error ? error.message : null };
  }

  async upsertHomepageExpertiseCard(id: string, card: Partial<HomepageExpertiseCardRow>): Promise<{ error: string | null }> {
    const { error } = await this.supabase.client
      .from('homepage_expertise_cards')
      .update({ ...card, updated_at: new Date().toISOString() })
      .eq('id', id);
    return { error: error ? error.message : null };
  }

  async deleteHomepageExpertiseCard(id: string): Promise<{ error: string | null }> {
    const { error } = await this.supabase.client
      .from('homepage_expertise_cards')
      .delete()
      .eq('id', id);
    return { error: error ? error.message : null };
  }

  async getHomepageImages(): Promise<{ data: HomepageImageRow[]; error: string | null }> {
    const { data, error } = await this.supabase.client
      .from('homepage_images')
      .select('*');
    return { data: (data as HomepageImageRow[]) ?? [], error: error ? error.message : null };
  }

  async upsertHomepageImage(imageKey: string, url: string, altText: string): Promise<{ error: string | null }> {
    const { error } = await this.supabase.client
      .from('homepage_images')
      .upsert({ image_key: imageKey, url, alt_text: altText, updated_at: new Date().toISOString() });
    return { error: error ? error.message : null };
  }

  async getHomepageHeroContent(): Promise<{ data: HomepageHeroContentRow | null; error: string | null }> {
    const { data, error } = await this.supabase.client
      .from('homepage_hero_content')
      .select('*')
      .eq('id', 1)
      .maybeSingle();
    return { data: data as HomepageHeroContentRow ?? null, error: error ? error.message : null };
  }

  async upsertHomepageHeroContent(content: HomepageHeroContentRow): Promise<{ error: string | null }> {
    const { error } = await this.supabase.client
      .from('homepage_hero_content')
      .upsert({ ...content, id: 1, updated_at: new Date().toISOString() })
      .eq('id', 1);
    return { error: error ? error.message : null };
  }
}