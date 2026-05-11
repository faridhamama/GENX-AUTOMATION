import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import type { CompanyInfo, CompanyValue, Service } from './company-info.service';

export interface QuoteRequest {
  full_name: string;
  phone: string;
  email: string;
  desired_date: string | null;
  project_type: string;
  description: string;
}

export interface QuoteRequestRow extends QuoteRequest {
  id: string;
  read: boolean;
  created_at: string;
}

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private readonly _client: SupabaseClient = createClient(
    environment.supabaseUrl,
    environment.supabaseAnonKey,
  );

  get client(): SupabaseClient {
    return this._client;
  }

  async signIn(email: string, password: string): Promise<{ error: string | null }> {
    const { error } = await this.client.auth.signInWithPassword({ email, password });
    return { error: error ? error.message : null };
  }

  async signOut(): Promise<void> {
    await this.client.auth.signOut();
  }

  onAuthStateChange(callback: (event: string, session: unknown) => void): () => void {
    const { data } = this.client.auth.onAuthStateChange(callback);
    return () => data.subscription.unsubscribe();
  }

  async insertQuoteRequest(data: QuoteRequest): Promise<{ error: string | null }> {
    const { error } = await this.client.from('quote_requests').insert(data);
    return { error: error ? error.message : null };
  }

  async fetchQuoteRequests(): Promise<{ data: QuoteRequestRow[]; error: string | null }> {
    const { data, error } = await this.client
      .from('quote_requests')
      .select('*')
      .order('created_at', { ascending: false });
    return { data: (data as QuoteRequestRow[]) ?? [], error: error ? error.message : null };
  }

  async markAsRead(id: string): Promise<{ error: string | null }> {
    const { error } = await this.client
      .from('quote_requests')
      .update({ read: true })
      .eq('id', id);
    return { error: error ? error.message : null };
  }

  async getCompanyInfo(): Promise<{ data: CompanyInfo | null; error: string | null }> {
    const { data, error } = await this._client.from('company_info').select('*').eq('id', 1).maybeSingle();
    return { data, error: error ? error.message : null };
  }

  async updateCompanyInfo(info: Partial<CompanyInfo>): Promise<{ error: string | null }> {
    const { error } = await this._client.from('company_info').update({ ...info, updated_at: new Date().toISOString() }).eq('id', 1);
    return { error: error ? error.message : null };
  }

  async getServices(): Promise<{ data: Service[]; error: string | null }> {
    const { data, error } = await this._client.from('services').select('*').order('sort_order', { ascending: true });
    return { data: (data as Service[]) ?? [], error: error ? error.message : null };
  }

  async createService(label: string, description: string, sortOrder: number): Promise<{ error: string | null }> {
    const { error } = await this._client.from('services').insert({ label, description, sort_order: sortOrder });
    return { error: error ? error.message : null };
  }

  async updateService(id: string, label: string, description: string): Promise<{ error: string | null }> {
    const { error } = await this._client.from('services').update({ label, description, updated_at: new Date().toISOString() }).eq('id', id);
    return { error: error ? error.message : null };
  }

  async deleteService(id: string): Promise<{ error: string | null }> {
    const { error } = await this._client.from('services').delete().eq('id', id);
    return { error: error ? error.message : null };
  }

  async updateServiceOrder(id: string, sortOrder: number): Promise<{ error: string | null }> {
    const { error } = await this._client.from('services').update({ sort_order: sortOrder, updated_at: new Date().toISOString() }).eq('id', id);
    return { error: error ? error.message : null };
  }

  async swapServiceOrder(id1: string, id2: string): Promise<{ error: string | null }> {
    const TEMP = 0; // outside normal sort range, always unique
    const { error: e0 } = await this._client.from('services').update({ sort_order: TEMP, updated_at: new Date().toISOString() }).eq('id', id1);
    if (e0) return { error: e0.message };
    const { data: row2 } = await this._client.from('services').select('sort_order').eq('id', id2).maybeSingle();
    const sort2 = (row2 as any)?.sort_order ?? 2;
    const { error: e1 } = await this._client.from('services').update({ sort_order: TEMP, updated_at: new Date().toISOString() }).eq('id', id2);
    if (e1) return { error: e1.message };
    const { error: e2 } = await this._client.from('services').update({ sort_order: sort2, updated_at: new Date().toISOString() }).eq('id', id1);
    if (e2) return { error: e2.message };
    const { data: row1 } = await this._client.from('services').select('sort_order').eq('id', id1).maybeSingle();
    const sort1 = (row1 as any)?.sort_order ?? 1;
    const { error: e3 } = await this._client.from('services').update({ sort_order: sort1, updated_at: new Date().toISOString() }).eq('id', id2);
    return { error: e3 ? e3.message : null };
  }

  async getCompanyValues(): Promise<{ data: CompanyValue[]; error: string | null }> {
    const { data, error } = await this._client.from('company_values').select('*').order('sort_order', { ascending: true });
    return { data: (data as CompanyValue[]) ?? [], error: error ? error.message : null };
  }

  async updateCompanyValue(id: string, data: { icon: string; title: string; description: string }): Promise<{ error: string | null }> {
    const { error } = await this._client.from('company_values').update({ ...data, updated_at: new Date().toISOString() }).eq('id', id);
    return { error: error ? error.message : null };
  }

  // --- Homepage ---
  async getHomepageHeroStats(): Promise<{ data: HomepageHeroStatsRow | null; error: string | null }> {
    const { data, error } = await this._client.from('homepage_hero_stats').select('*').eq('id', 1).maybeSingle();
    return { data: data as HomepageHeroStatsRow ?? null, error: error ? error.message : null };
  }

  async upsertHomepageHeroStats(stats: HomepageHeroStatsRow): Promise<{ error: string | null }> {
    const { error } = await this._client.from('homepage_hero_stats').upsert({ ...stats, id: 1, updated_at: new Date().toISOString() }).eq('id', 1);
    return { error: error ? error.message : null };
  }

  async getHomepageExpertiseCards(): Promise<{ data: HomepageExpertiseCardRow[]; error: string | null }> {
    const { data, error } = await this._client.from('homepage_expertise_cards').select('*').order('sort_order', { ascending: true });
    return { data: (data as HomepageExpertiseCardRow[]) ?? [], error: error ? error.message : null };
  }

  async upsertHomepageExpertiseCard(id: string, card: Partial<HomepageExpertiseCardRow>): Promise<{ error: string | null }> {
    const { error } = await this._client.from('homepage_expertise_cards').update({ ...card, updated_at: new Date().toISOString() }).eq('id', id);
    return { error: error ? error.message : null };
  }

  async getHomepageImages(): Promise<{ data: HomepageImageRow[]; error: string | null }> {
    const { data, error } = await this._client.from('homepage_images').select('*');
    return { data: (data as HomepageImageRow[]) ?? [], error: error ? error.message : null };
  }

  async upsertHomepageImage(imageKey: string, url: string, altText: string): Promise<{ error: string | null }> {
    const { error } = await this._client.from('homepage_images').upsert({ image_key: imageKey, url, alt_text: altText, updated_at: new Date().toISOString() });
    return { error: error ? error.message : null };
  }

  async deleteHomepageExpertiseCard(id: string): Promise<{ error: string | null }> {
    const { error } = await this._client.from('homepage_expertise_cards').delete().eq('id', id);
    return { error: error ? error.message : null };
  }
}

interface HomepageHeroStatsRow { id: number; stat1_label: string; stat1_value: string; stat1_sub: string; stat1_accent_class: string; stat2_label: string; stat2_value: string; stat2_sub: string; stat2_accent_class: string; updated_at: string }
interface HomepageExpertiseCardRow { id: string; sort_order: number; icon: string; title: string; description: string; tags: string[]; updated_at: string }
interface HomepageImageRow { image_key: string; url: string; alt_text: string; updated_at: string }
