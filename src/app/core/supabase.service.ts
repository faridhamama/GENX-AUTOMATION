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

  async getCompanyValues(): Promise<{ data: CompanyValue[]; error: string | null }> {
    const { data, error } = await this._client.from('company_values').select('*').order('sort_order', { ascending: true });
    return { data: (data as CompanyValue[]) ?? [], error: error ? error.message : null };
  }

  async updateCompanyValue(id: string, data: { icon: string; title: string; description: string }): Promise<{ error: string | null }> {
    const { error } = await this._client.from('company_values').update({ ...data, updated_at: new Date().toISOString() }).eq('id', id);
    return { error: error ? error.message : null };
  }
}
