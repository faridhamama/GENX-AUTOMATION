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

export interface ReferencesImageRow {
  image_key: string;
  url: string;
  alt_text: string;
  updated_at: string;
}

export interface ReferencesHeroRow {
  id: number;
  label: string;
  headline: string;
  body: string;
  updated_at: string;
}

export interface ReferencesFeaturedProjectRow {
  id: number;
  sector: string;
  title: string;
  technology: string;
  tech_label: string;
  specs_json: string;
  image_key: string;
  image_alt: string;
  result: string;
  updated_at: string;
}

export interface ReferencesPerformanceStatRow {
  id: string;
  sort_order: number;
  value: string;
  label: string;
  updated_at: string;
}

export interface ReferencesSideProjectRow {
  id: string;
  sort_order: number;
  sector: string;
  title: string;
  description: string;
  key_spec: string;
  updated_at: string;
}

export interface ReferencesQualityPointRow {
  id: string;
  sort_order: number;
  icon: string;
  title: string;
  description: string;
  updated_at: string;
}

export interface HomepageHeroStatsRow {
  id: number;
  stat1_label: string;
  stat1_value: string;
  stat1_sub: string;
  stat1_accent_class: string;
  stat2_label: string;
  stat2_value: string;
  stat2_sub: string;
  stat2_accent_class: string;
  updated_at: string;
}

export interface HomepageImageRow {
  image_key: string;
  url: string;
  alt_text: string;
  updated_at: string;
}

export interface HomepageExpertiseCardRow {
  id: string;
  sort_order: number;
  icon: string;
  title: string;
  description: string;
  tags: string[];
  updated_at: string;
}

export interface ServicesImageRow {
  image_key: string;
  url: string;
  alt_text: string;
  updated_at: string;
}

export interface ServicesPageHeroRow {
  id: number;
  label: string;
  headline: string;
  body: string;
  updated_at: string;
}

export interface ServicesMethodologyRow {
  id: number;
  section_label: string;
  headline: string;
  subtext: string;
  updated_at: string;
}

export interface MethodologyStepRow {
  id: string;
  sort_order: number;
  step_number: number;
  title: string;
  description: string;
  updated_at: string;
}

export interface AboutHeroRow {
  id: number;
  label: string;
  headline: string;
  body: string;
  updated_at: string;
}

export interface AboutAvailabilityRow {
  id: number;
  label: string;
  days: string;
  hours: string;
  updated_at: string;
}

export interface AboutMissionRow {
  id: number;
  label: string;
  quote: string;
  updated_at: string;
}

export interface AboutCompanyRow {
  id: number;
  label: string;
  body: string;
  updated_at: string;
}

export interface AboutServicesSectionRow {
  id: number;
  headline: string;
  subtext: string;
  updated_at: string;
}

export interface AboutValuesSectionRow {
  id: number;
  headline: string;
  subtext: string;
  updated_at: string;
}

export interface AboutCtaSectionRow {
  id: number;
  headline: string;
  subtext: string;
  cta_primary_label: string;
  cta_primary_link: string;
  cta_secondary_label: string;
  cta_secondary_link: string;
  updated_at: string;
}

export interface AboutImageRow {
  image_key: string;
  url: string;
  alt_text: string;
  updated_at: string;
}

export interface ContactPageHeroRow {
  id: number;
  label: string;
  headline: string;
  body: string;
  updated_at: string;
}

export interface ContactStatRow {
  id: string;
  sort_order: number;
  value: string;
  label: string;
  updated_at: string;
}

export interface ProjectTypeRow {
  id: string;
  sort_order: number;
  label: string;
  updated_at: string;
}

export interface ContactFormContentRow {
  id: number;
  form_title: string;
  success_title: string;
  success_body: string;
  error_message: string;
  footer_note: string;
  submit_label: string;
  loading_label: string;
  updated_at: string;
}

export interface FormLabelsRow {
  id: number;
  full_name_label: string;
  full_name_error: string;
  full_name_placeholder: string;
  phone_label: string;
  phone_error: string;
  phone_placeholder: string;
  email_label: string;
  email_error: string;
  email_placeholder: string;
  desired_date_label: string;
  desired_date_placeholder: string;
  project_type_label: string;
  description_label: string;
  description_error: string;
  description_placeholder: string;
  updated_at: string;
}

export interface HomepageHeroContentRow {
  id: number;
  hero_badge: string;
  hero_headline: string;
  hero_body: string;
  cta_primary_label: string;
  cta_secondary_label: string;
  stats_image_caption: string;
  expertise_label: string;
  expertise_headline: string;
  expertise_subtext: string;
  cta_section_headline: string;
  cta_section_body: string;
  cta_section_label: string;
  updated_at: string;
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

  // --- Services ---
  async getServicesPageHero(): Promise<{ data: ServicesPageHeroRow | null; error: string | null }> {
    const { data, error } = await this._client.from('services_page_hero').select('*').eq('id', 1).maybeSingle();
    return { data: data as ServicesPageHeroRow ?? null, error: error ? error.message : null };
  }

  async upsertServicesPageHero(hero: ServicesPageHeroRow): Promise<{ error: string | null }> {
    const { error } = await this._client.from('services_page_hero').upsert({ ...hero, id: 1, updated_at: new Date().toISOString() }).eq('id', 1);
    return { error: error ? error.message : null };
  }

  async getServicesMethodology(): Promise<{ data: ServicesMethodologyRow | null; error: string | null }> {
    const { data, error } = await this._client.from('services_methodology').select('*').eq('id', 1).maybeSingle();
    return { data: data as ServicesMethodologyRow ?? null, error: error ? error.message : null };
  }

  async upsertServicesMethodology(methodology: ServicesMethodologyRow): Promise<{ error: string | null }> {
    const { error } = await this._client.from('services_methodology').upsert({ ...methodology, id: 1, updated_at: new Date().toISOString() }).eq('id', 1);
    return { error: error ? error.message : null };
  }

  async getMethodologySteps(): Promise<{ data: MethodologyStepRow[]; error: string | null }> {
    const { data, error } = await this._client.from('methodology_steps').select('*').order('sort_order', { ascending: true });
    return { data: (data as MethodologyStepRow[]) ?? [], error: error ? error.message : null };
  }

  async upsertMethodologyStep(id: string, step: Partial<MethodologyStepRow>): Promise<{ error: string | null }> {
    const { error } = await this._client.from('methodology_steps').update({ ...step, updated_at: new Date().toISOString() }).eq('id', id);
    return { error: error ? error.message : null };
  }

  async getServicesImages(): Promise<{ data: ServicesImageRow[]; error: string | null }> {
    const { data, error } = await this._client.from('services_images').select('*');
    return { data: (data as ServicesImageRow[]) ?? [], error: error ? error.message : null };
  }

  async upsertServicesImage(imageKey: string, url: string, altText: string): Promise<{ error: string | null }> {
    const { error } = await this._client.from('services_images').upsert({ image_key: imageKey, url, alt_text: altText, updated_at: new Date().toISOString() });
    return { error: error ? error.message : null };
  }

  // --- About ---
  async getAboutHero(): Promise<{ data: AboutHeroRow | null; error: string | null }> {
    const { data, error } = await this._client.from('about_hero').select('*').eq('id', 1).maybeSingle();
    return { data: data as AboutHeroRow ?? null, error: error ? error.message : null };
  }
  async upsertAboutHero(hero: AboutHeroRow): Promise<{ error: string | null }> {
    const { error } = await this._client.from('about_hero').upsert({ ...hero, id: 1, updated_at: new Date().toISOString() }).eq('id', 1);
    return { error: error ? error.message : null };
  }
  async getAboutAvailability(): Promise<{ data: AboutAvailabilityRow | null; error: string | null }> {
    const { data, error } = await this._client.from('about_availability').select('*').eq('id', 1).maybeSingle();
    return { data: data as AboutAvailabilityRow ?? null, error: error ? error.message : null };
  }
  async upsertAboutAvailability(avail: AboutAvailabilityRow): Promise<{ error: string | null }> {
    const { error } = await this._client.from('about_availability').upsert({ ...avail, id: 1, updated_at: new Date().toISOString() }).eq('id', 1);
    return { error: error ? error.message : null };
  }
  async getAboutMission(): Promise<{ data: AboutMissionRow | null; error: string | null }> {
    const { data, error } = await this._client.from('about_mission').select('*').eq('id', 1).maybeSingle();
    return { data: data as AboutMissionRow ?? null, error: error ? error.message : null };
  }
  async upsertAboutMission(mission: AboutMissionRow): Promise<{ error: string | null }> {
    const { error } = await this._client.from('about_mission').upsert({ ...mission, id: 1, updated_at: new Date().toISOString() }).eq('id', 1);
    return { error: error ? error.message : null };
  }
  async getAboutCompany(): Promise<{ data: AboutCompanyRow | null; error: string | null }> {
    const { data, error } = await this._client.from('about_company').select('*').eq('id', 1).maybeSingle();
    return { data: data as AboutCompanyRow ?? null, error: error ? error.message : null };
  }
  async upsertAboutCompany(company: AboutCompanyRow): Promise<{ error: string | null }> {
    const { error } = await this._client.from('about_company').upsert({ ...company, id: 1, updated_at: new Date().toISOString() }).eq('id', 1);
    return { error: error ? error.message : null };
  }
  async getAboutServicesSection(): Promise<{ data: AboutServicesSectionRow | null; error: string | null }> {
    const { data, error } = await this._client.from('about_services_section').select('*').eq('id', 1).maybeSingle();
    return { data: data as AboutServicesSectionRow ?? null, error: error ? error.message : null };
  }
  async upsertAboutServicesSection(section: AboutServicesSectionRow): Promise<{ error: string | null }> {
    const { error } = await this._client.from('about_services_section').upsert({ ...section, id: 1, updated_at: new Date().toISOString() }).eq('id', 1);
    return { error: error ? error.message : null };
  }
  async getAboutValuesSection(): Promise<{ data: AboutValuesSectionRow | null; error: string | null }> {
    const { data, error } = await this._client.from('about_values_section').select('*').eq('id', 1).maybeSingle();
    return { data: data as AboutValuesSectionRow ?? null, error: error ? error.message : null };
  }
  async upsertAboutValuesSection(section: AboutValuesSectionRow): Promise<{ error: string | null }> {
    const { error } = await this._client.from('about_values_section').upsert({ ...section, id: 1, updated_at: new Date().toISOString() }).eq('id', 1);
    return { error: error ? error.message : null };
  }
  async getAboutCtaSection(): Promise<{ data: AboutCtaSectionRow | null; error: string | null }> {
    const { data, error } = await this._client.from('about_cta_section').select('*').eq('id', 1).maybeSingle();
    return { data: data as AboutCtaSectionRow ?? null, error: error ? error.message : null };
  }
  async upsertAboutCtaSection(cta: AboutCtaSectionRow): Promise<{ error: string | null }> {
    const { error } = await this._client.from('about_cta_section').upsert({ ...cta, id: 1, updated_at: new Date().toISOString() }).eq('id', 1);
    return { error: error ? error.message : null };
  }
  async getAboutImages(): Promise<{ data: AboutImageRow[]; error: string | null }> {
    const { data, error } = await this._client.from('about_images').select('*');
    return { data: (data as AboutImageRow[]) ?? [], error: error ? error.message : null };
  }
  async upsertAboutImage(imageKey: string, url: string, altText: string): Promise<{ error: string | null }> {
    const { error } = await this._client.from('about_images').upsert({ image_key: imageKey, url, alt_text: altText, updated_at: new Date().toISOString() });
    return { error: error ? error.message : null };
  }

  // --- Contact ---
  async getContactPageHero(): Promise<{ data: ContactPageHeroRow | null; error: string | null }> {
    const { data, error } = await this._client.from('contact_page_hero').select('*').eq('id', 1).maybeSingle();
    return { data: data as ContactPageHeroRow ?? null, error: error ? error.message : null };
  }
  async upsertContactPageHero(hero: ContactPageHeroRow): Promise<{ error: string | null }> {
    const { error } = await this._client.from('contact_page_hero').upsert({ ...hero, id: 1, updated_at: new Date().toISOString() }).eq('id', 1);
    return { error: error ? error.message : null };
  }
  async getContactStats(): Promise<{ data: ContactStatRow[]; error: string | null }> {
    const { data, error } = await this._client.from('contact_stats').select('*').order('sort_order', { ascending: true });
    return { data: (data as ContactStatRow[]) ?? [], error: error ? error.message : null };
  }
  async upsertContactStat(stat: Partial<ContactStatRow> & { id: string }): Promise<{ error: string | null }> {
    const { error } = await this._client.from('contact_stats').update({ ...stat, updated_at: new Date().toISOString() }).eq('id', stat.id);
    return { error: error ? error.message : null };
  }
  async getProjectTypes(): Promise<{ data: ProjectTypeRow[]; error: string | null }> {
    const { data, error } = await this._client.from('project_types').select('*').order('sort_order', { ascending: true });
    return { data: (data as ProjectTypeRow[]) ?? [], error: error ? error.message : null };
  }
  async upsertProjectType(id: string, label: string): Promise<{ error: string | null }> {
    const { error } = await this._client.from('project_types').update({ label, updated_at: new Date().toISOString() }).eq('id', id);
    return { error: error ? error.message : null };
  }
  async getContactFormContent(): Promise<{ data: ContactFormContentRow | null; error: string | null }> {
    const { data, error } = await this._client.from('contact_form_content').select('*').eq('id', 1).maybeSingle();
    return { data: data as ContactFormContentRow ?? null, error: error ? error.message : null };
  }
  async upsertContactFormContent(content: ContactFormContentRow): Promise<{ error: string | null }> {
    const { error } = await this._client.from('contact_form_content').upsert({ ...content, id: 1, updated_at: new Date().toISOString() }).eq('id', 1);
    return { error: error ? error.message : null };
  }
  async getFormLabels(): Promise<{ data: FormLabelsRow | null; error: string | null }> {
    const { data, error } = await this._client.from('form_labels').select('*').eq('id', 1).maybeSingle();
    return { data: data as FormLabelsRow ?? null, error: error ? error.message : null };
  }
  async upsertFormLabels(labels: FormLabelsRow): Promise<{ error: string | null }> {
    const { error } = await this._client.from('form_labels').upsert({ ...labels, id: 1, updated_at: new Date().toISOString() }).eq('id', 1);
    return { error: error ? error.message : null };
  }

  // --- References ---
  async getReferencesHero(): Promise<{ data: ReferencesHeroRow | null; error: string | null }> {
    const { data, error } = await this._client.from('references_hero').select('*').eq('id', 1).maybeSingle();
    return { data: data as ReferencesHeroRow ?? null, error: error ? error.message : null };
  }

  async upsertReferencesHero(hero: ReferencesHeroRow): Promise<{ error: string | null }> {
    const { error } = await this._client.from('references_hero').upsert({ ...hero, id: 1, updated_at: new Date().toISOString() }).eq('id', 1);
    return { error: error ? error.message : null };
  }

  async getReferencesFeaturedProject(): Promise<{ data: ReferencesFeaturedProjectRow | null; error: string | null }> {
    const { data, error } = await this._client.from('references_featured_project').select('*').eq('id', 1).maybeSingle();
    return { data: data as ReferencesFeaturedProjectRow ?? null, error: error ? error.message : null };
  }

  async upsertReferencesFeaturedProject(project: ReferencesFeaturedProjectRow): Promise<{ error: string | null }> {
    const { error } = await this._client.from('references_featured_project').upsert({ ...project, id: 1, updated_at: new Date().toISOString() }).eq('id', 1);
    return { error: error ? error.message : null };
  }

  async getReferencesPerformanceStats(): Promise<{ data: ReferencesPerformanceStatRow[]; error: string | null }> {
    const { data, error } = await this._client.from('references_performance_stats').select('*').order('sort_order', { ascending: true });
    return { data: (data as ReferencesPerformanceStatRow[]) ?? [], error: error ? error.message : null };
  }

  async upsertReferencesPerformanceStat(stat: Partial<ReferencesPerformanceStatRow> & { id: string }): Promise<{ error: string | null }> {
    const { error } = await this._client.from('references_performance_stats').update({ ...stat, updated_at: new Date().toISOString() }).eq('id', stat.id);
    return { error: error ? error.message : null };
  }

  async getReferencesSideProjects(): Promise<{ data: ReferencesSideProjectRow[]; error: string | null }> {
    const { data, error } = await this._client.from('references_side_projects').select('*').order('sort_order', { ascending: true });
    return { data: (data as ReferencesSideProjectRow[]) ?? [], error: error ? error.message : null };
  }

  async upsertReferencesSideProject(id: string, project: Partial<ReferencesSideProjectRow>): Promise<{ error: string | null }> {
    const { error } = await this._client.from('references_side_projects').update({ ...project, updated_at: new Date().toISOString() }).eq('id', id);
    return { error: error ? error.message : null };
  }

  async deleteReferencesSideProject(id: string): Promise<{ error: string | null }> {
    const { error } = await this._client.from('references_side_projects').delete().eq('id', id);
    return { error: error ? error.message : null };
  }

  async getReferencesQualityPoints(): Promise<{ data: ReferencesQualityPointRow[]; error: string | null }> {
    const { data, error } = await this._client.from('references_quality_points').select('*').order('sort_order', { ascending: true });
    return { data: (data as ReferencesQualityPointRow[]) ?? [], error: error ? error.message : null };
  }

  async upsertReferencesQualityPoint(id: string, point: Partial<ReferencesQualityPointRow>): Promise<{ error: string | null }> {
    const { error } = await this._client.from('references_quality_points').update({ ...point, updated_at: new Date().toISOString() }).eq('id', id);
    return { error: error ? error.message : null };
  }

  async getReferencesImages(): Promise<{ data: ReferencesImageRow[]; error: string | null }> {
    const { data, error } = await this._client.from('references_images').select('*');
    return { data: (data as ReferencesImageRow[]) ?? [], error: error ? error.message : null };
  }

  async upsertReferencesImage(imageKey: string, url: string, altText: string): Promise<{ error: string | null }> {
    const { error } = await this._client.from('references_images').upsert({ image_key: imageKey, url, alt_text: altText, updated_at: new Date().toISOString() });
    return { error: error ? error.message : null };
  }

  // --- Homepage Hero Content ---
  async getHomepageHeroContent(): Promise<{ data: HomepageHeroContentRow | null; error: string | null }> {
    const { data, error } = await this._client.from('homepage_hero_content').select('*').eq('id', 1).maybeSingle();
    return { data: data as HomepageHeroContentRow ?? null, error: error ? error.message : null };
  }
  async upsertHomepageHeroContent(content: HomepageHeroContentRow): Promise<{ error: string | null }> {
    const { error } = await this._client.from('homepage_hero_content').upsert({ ...content, id: 1, updated_at: new Date().toISOString() }).eq('id', 1);
    return { error: error ? error.message : null };
  }
}
