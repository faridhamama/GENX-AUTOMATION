import { inject, Injectable } from '@angular/core';
import type { ServicesPageHeroRow, ServicesMethodologyRow, MethodologyStepRow, ServicesImageRow } from '../models/index';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class ServicesPageDbService {
  private readonly supabase = inject(SupabaseService);

  async getServicesPageHero(): Promise<{ data: ServicesPageHeroRow | null; error: string | null }> {
    const { data, error } = await this.supabase.client.from('services_page_hero').select('*').eq('id', 1).maybeSingle();
    return { data: data as ServicesPageHeroRow ?? null, error: error ? error.message : null };
  }

  async upsertServicesPageHero(hero: ServicesPageHeroRow): Promise<{ error: string | null }> {
    const { error } = await this.supabase.client.from('services_page_hero').upsert({ ...hero, id: 1, updated_at: new Date().toISOString() }).eq('id', 1);
    return { error: error ? error.message : null };
  }

  async getServicesMethodology(): Promise<{ data: ServicesMethodologyRow | null; error: string | null }> {
    const { data, error } = await this.supabase.client.from('services_methodology').select('*').eq('id', 1).maybeSingle();
    return { data: data as ServicesMethodologyRow ?? null, error: error ? error.message : null };
  }

  async upsertServicesMethodology(methodology: ServicesMethodologyRow): Promise<{ error: string | null }> {
    const { error } = await this.supabase.client.from('services_methodology').upsert({ ...methodology, id: 1, updated_at: new Date().toISOString() }).eq('id', 1);
    return { error: error ? error.message : null };
  }

  async getMethodologySteps(): Promise<{ data: MethodologyStepRow[]; error: string | null }> {
    const { data, error } = await this.supabase.client.from('methodology_steps').select('*').order('sort_order', { ascending: true });
    return { data: (data as MethodologyStepRow[]) ?? [], error: error ? error.message : null };
  }

  async upsertMethodologyStep(id: string, step: Partial<MethodologyStepRow>): Promise<{ error: string | null }> {
    const { error } = await this.supabase.client.from('methodology_steps').update({ ...step, updated_at: new Date().toISOString() }).eq('id', id);
    return { error: error ? error.message : null };
  }

  async getServicesImages(): Promise<{ data: ServicesImageRow[]; error: string | null }> {
    const { data, error } = await this.supabase.client.from('services_images').select('*');
    return { data: (data as ServicesImageRow[]) ?? [], error: error ? error.message : null };
  }

  async upsertServicesImage(imageKey: string, url: string, altText: string): Promise<{ error: string | null }> {
    const { error } = await this.supabase.client.from('services_images').upsert({ image_key: imageKey, url, alt_text: altText, updated_at: new Date().toISOString() });
    return { error: error ? error.message : null };
  }
}