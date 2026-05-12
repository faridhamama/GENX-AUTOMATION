import { Injectable } from '@angular/core';
import { inject } from '@angular/core';

import type { ContactPageHeroRow, ContactStatRow, ProjectTypeRow, ContactFormContentRow, FormLabelsRow } from '../models/index';
import { SupabaseService } from '../supabase.service';

@Injectable({ providedIn: 'root' })
export class ContactDbService {
  private readonly supabase = inject(SupabaseService);

  async getContactPageHero(): Promise<{ data: ContactPageHeroRow | null; error: string | null }> {
    const { data, error } = await this.supabase.client
      .from('contact_page_hero')
      .select('*')
      .eq('id', 1)
      .maybeSingle();
    return { data: data as ContactPageHeroRow ?? null, error: error ? error.message : null };
  }

  async upsertContactPageHero(hero: ContactPageHeroRow): Promise<{ error: string | null }> {
    const { error } = await this.supabase.client
      .from('contact_page_hero')
      .upsert({ ...hero, id: 1, updated_at: new Date().toISOString() })
      .eq('id', 1);
    return { error: error ? error.message : null };
  }

  async getContactStats(): Promise<{ data: ContactStatRow[]; error: string | null }> {
    const { data, error } = await this.supabase.client
      .from('contact_stats')
      .select('*')
      .order('sort_order', { ascending: true });
    return { data: (data as ContactStatRow[]) ?? [], error: error ? error.message : null };
  }

  async upsertContactStat(stat: Partial<ContactStatRow> & { id: string }): Promise<{ error: string | null }> {
    const { error } = await this.supabase.client
      .from('contact_stats')
      .update({ ...stat, updated_at: new Date().toISOString() })
      .eq('id', stat.id);
    return { error: error ? error.message : null };
  }

  async getProjectTypes(): Promise<{ data: ProjectTypeRow[]; error: string | null }> {
    const { data, error } = await this.supabase.client
      .from('project_types')
      .select('*')
      .order('sort_order', { ascending: true });
    return { data: (data as ProjectTypeRow[]) ?? [], error: error ? error.message : null };
  }

  async upsertProjectType(id: string, label: string): Promise<{ error: string | null }> {
    const { error } = await this.supabase.client
      .from('project_types')
      .update({ label, updated_at: new Date().toISOString() })
      .eq('id', id);
    return { error: error ? error.message : null };
  }

  async getContactFormContent(): Promise<{ data: ContactFormContentRow | null; error: string | null }> {
    const { data, error } = await this.supabase.client
      .from('contact_form_content')
      .select('*')
      .eq('id', 1)
      .maybeSingle();
    return { data: data as ContactFormContentRow ?? null, error: error ? error.message : null };
  }

  async upsertContactFormContent(content: ContactFormContentRow): Promise<{ error: string | null }> {
    const { error } = await this.supabase.client
      .from('contact_form_content')
      .upsert({ ...content, id: 1, updated_at: new Date().toISOString() })
      .eq('id', 1);
    return { error: error ? error.message : null };
  }

  async getFormLabels(): Promise<{ data: FormLabelsRow | null; error: string | null }> {
    const { data, error } = await this.supabase.client
      .from('form_labels')
      .select('*')
      .eq('id', 1)
      .maybeSingle();
    return { data: data as FormLabelsRow ?? null, error: error ? error.message : null };
  }

  async upsertFormLabels(labels: FormLabelsRow): Promise<{ error: string | null }> {
    const { error } = await this.supabase.client
      .from('form_labels')
      .upsert({ ...labels, id: 1, updated_at: new Date().toISOString() })
      .eq('id', 1);
    return { error: error ? error.message : null };
  }
}