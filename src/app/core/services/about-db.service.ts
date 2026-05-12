import { Injectable } from '@angular/core';
import { inject } from '@angular/core';

import type {
  AboutHeroRow,
  AboutAvailabilityRow,
  AboutMissionRow,
  AboutCompanyRow,
  AboutServicesSectionRow,
  AboutValuesSectionRow,
  AboutCtaSectionRow,
  AboutImageRow,
} from '../models/index';
import { SupabaseService } from '../supabase.service';

@Injectable({ providedIn: 'root' })
export class AboutDbService {
  private readonly supabase = inject(SupabaseService);

  async getAboutHero(): Promise<{ data: AboutHeroRow | null; error: string | null }> {
    const { data, error } = await this.supabase.client
      .from('about_hero')
      .select('*')
      .eq('id', 1)
      .maybeSingle();
    return { data: data as AboutHeroRow ?? null, error: error ? error.message : null };
  }

  async upsertAboutHero(hero: AboutHeroRow): Promise<{ error: string | null }> {
    const { error } = await this.supabase.client
      .from('about_hero')
      .upsert({ ...hero, id: 1, updated_at: new Date().toISOString() })
      .eq('id', 1);
    return { error: error ? error.message : null };
  }

  async getAboutAvailability(): Promise<{ data: AboutAvailabilityRow | null; error: string | null }> {
    const { data, error } = await this.supabase.client
      .from('about_availability')
      .select('*')
      .eq('id', 1)
      .maybeSingle();
    return { data: data as AboutAvailabilityRow ?? null, error: error ? error.message : null };
  }

  async upsertAboutAvailability(avail: AboutAvailabilityRow): Promise<{ error: string | null }> {
    const { error } = await this.supabase.client
      .from('about_availability')
      .upsert({ ...avail, id: 1, updated_at: new Date().toISOString() })
      .eq('id', 1);
    return { error: error ? error.message : null };
  }

  async getAboutMission(): Promise<{ data: AboutMissionRow | null; error: string | null }> {
    const { data, error } = await this.supabase.client
      .from('about_mission')
      .select('*')
      .eq('id', 1)
      .maybeSingle();
    return { data: data as AboutMissionRow ?? null, error: error ? error.message : null };
  }

  async upsertAboutMission(mission: AboutMissionRow): Promise<{ error: string | null }> {
    const { error } = await this.supabase.client
      .from('about_mission')
      .upsert({ ...mission, id: 1, updated_at: new Date().toISOString() })
      .eq('id', 1);
    return { error: error ? error.message : null };
  }

  async getAboutCompany(): Promise<{ data: AboutCompanyRow | null; error: string | null }> {
    const { data, error } = await this.supabase.client
      .from('about_company')
      .select('*')
      .eq('id', 1)
      .maybeSingle();
    return { data: data as AboutCompanyRow ?? null, error: error ? error.message : null };
  }

  async upsertAboutCompany(company: AboutCompanyRow): Promise<{ error: string | null }> {
    const { error } = await this.supabase.client
      .from('about_company')
      .upsert({ ...company, id: 1, updated_at: new Date().toISOString() })
      .eq('id', 1);
    return { error: error ? error.message : null };
  }

  async getAboutServicesSection(): Promise<{ data: AboutServicesSectionRow | null; error: string | null }> {
    const { data, error } = await this.supabase.client
      .from('about_services_section')
      .select('*')
      .eq('id', 1)
      .maybeSingle();
    return { data: data as AboutServicesSectionRow ?? null, error: error ? error.message : null };
  }

  async upsertAboutServicesSection(section: AboutServicesSectionRow): Promise<{ error: string | null }> {
    const { error } = await this.supabase.client
      .from('about_services_section')
      .upsert({ ...section, id: 1, updated_at: new Date().toISOString() })
      .eq('id', 1);
    return { error: error ? error.message : null };
  }

  async getAboutValuesSection(): Promise<{ data: AboutValuesSectionRow | null; error: string | null }> {
    const { data, error } = await this.supabase.client
      .from('about_values_section')
      .select('*')
      .eq('id', 1)
      .maybeSingle();
    return { data: data as AboutValuesSectionRow ?? null, error: error ? error.message : null };
  }

  async upsertAboutValuesSection(section: AboutValuesSectionRow): Promise<{ error: string | null }> {
    const { error } = await this.supabase.client
      .from('about_values_section')
      .upsert({ ...section, id: 1, updated_at: new Date().toISOString() })
      .eq('id', 1);
    return { error: error ? error.message : null };
  }

  async getAboutCtaSection(): Promise<{ data: AboutCtaSectionRow | null; error: string | null }> {
    const { data, error } = await this.supabase.client
      .from('about_cta_section')
      .select('*')
      .eq('id', 1)
      .maybeSingle();
    return { data: data as AboutCtaSectionRow ?? null, error: error ? error.message : null };
  }

  async upsertAboutCtaSection(cta: AboutCtaSectionRow): Promise<{ error: string | null }> {
    const { error } = await this.supabase.client
      .from('about_cta_section')
      .upsert({ ...cta, id: 1, updated_at: new Date().toISOString() })
      .eq('id', 1);
    return { error: error ? error.message : null };
  }

  async getAboutImages(): Promise<{ data: AboutImageRow[]; error: string | null }> {
    const { data, error } = await this.supabase.client
      .from('about_images')
      .select('*');
    return { data: (data as AboutImageRow[]) ?? [], error: error ? error.message : null };
  }

  async upsertAboutImage(imageKey: string, url: string, altText: string): Promise<{ error: string | null }> {
    const { error } = await this.supabase.client
      .from('about_images')
      .upsert({ image_key: imageKey, url, alt_text: altText, updated_at: new Date().toISOString() });
    return { error: error ? error.message : null };
  }
}