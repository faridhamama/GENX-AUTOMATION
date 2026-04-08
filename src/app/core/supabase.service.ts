import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

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
}
