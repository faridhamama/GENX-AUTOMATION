import { inject, Injectable } from '@angular/core';
import type { CompanyInfo, Service, CompanyValue } from '../models/index';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class CompanyDbService {
  private readonly supabase = inject(SupabaseService);

  async getCompanyInfo(): Promise<{ data: CompanyInfo | null; error: string | null }> {
    const { data, error } = await this.supabase.client.from('company_info').select('*').eq('id', 1).maybeSingle();
    return { data, error: error ? error.message : null };
  }

  async updateCompanyInfo(info: Partial<CompanyInfo>): Promise<{ error: string | null }> {
    const { error } = await this.supabase.client.from('company_info').update({ ...info, updated_at: new Date().toISOString() }).eq('id', 1);
    return { error: error ? error.message : null };
  }

  async getServices(): Promise<{ data: Service[]; error: string | null }> {
    const { data, error } = await this.supabase.client.from('services').select('*').order('sort_order', { ascending: true });
    return { data: (data as Service[]) ?? [], error: error ? error.message : null };
  }

  async createService(label: string, description: string, sortOrder: number): Promise<{ error: string | null }> {
    const { error } = await this.supabase.client.from('services').insert({ label, description, sort_order: sortOrder });
    return { error: error ? error.message : null };
  }

  async updateService(id: string, label: string, description: string): Promise<{ error: string | null }> {
    const { error } = await this.supabase.client.from('services').update({ label, description, updated_at: new Date().toISOString() }).eq('id', id);
    return { error: error ? error.message : null };
  }

  async deleteService(id: string): Promise<{ error: string | null }> {
    const { error } = await this.supabase.client.from('services').delete().eq('id', id);
    return { error: error ? error.message : null };
  }

  async updateServiceOrder(id: string, sortOrder: number): Promise<{ error: string | null }> {
    const { error } = await this.supabase.client.from('services').update({ sort_order: sortOrder, updated_at: new Date().toISOString() }).eq('id', id);
    return { error: error ? error.message : null };
  }

  async swapServiceOrder(id1: string, id2: string): Promise<{ error: string | null }> {
    const TEMP = 0;
    const { error: e0 } = await this.supabase.client.from('services').update({ sort_order: TEMP, updated_at: new Date().toISOString() }).eq('id', id1);
    if (e0) return { error: e0.message };
    const { data: row2 } = await this.supabase.client.from('services').select('sort_order').eq('id', id2).maybeSingle() as { data: { sort_order: number } | null };
    const sort2 = row2?.sort_order ?? 2;
    const { error: e1 } = await this.supabase.client.from('services').update({ sort_order: TEMP, updated_at: new Date().toISOString() }).eq('id', id2);
    if (e1) return { error: e1.message };
    const { error: e2 } = await this.supabase.client.from('services').update({ sort_order: sort2, updated_at: new Date().toISOString() }).eq('id', id1);
    if (e2) return { error: e2.message };
    const { data: row1 } = await this.supabase.client.from('services').select('sort_order').eq('id', id1).maybeSingle() as { data: { sort_order: number } | null };
    const sort1 = row1?.sort_order ?? 1;
    const { error: e3 } = await this.supabase.client.from('services').update({ sort_order: sort1, updated_at: new Date().toISOString() }).eq('id', id2);
    return { error: e3 ? e3.message : null };
  }

  async getCompanyValues(): Promise<{ data: CompanyValue[]; error: string | null }> {
    const { data, error } = await this.supabase.client.from('company_values').select('*').order('sort_order', { ascending: true });
    return { data: (data as CompanyValue[]) ?? [], error: error ? error.message : null };
  }

  async updateCompanyValue(id: string, data: { icon: string; title: string; description: string }): Promise<{ error: string | null }> {
    const { error } = await this.supabase.client.from('company_values').update({ ...data, updated_at: new Date().toISOString() }).eq('id', id);
    return { error: error ? error.message : null };
  }
}