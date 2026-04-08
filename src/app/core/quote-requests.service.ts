import { inject, Injectable, signal } from '@angular/core';
import { SupabaseService, QuoteRequestRow } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class QuoteRequestsService {
  private readonly supabase = inject(SupabaseService);

  readonly requests = signal<QuoteRequestRow[]>([]);
  readonly isLoading = signal(false);

  readonly stats = signal({
    total: 0,
    unread: 0,
    today: 0,
    thisWeek: 0,
  });

  private readonly today = new Date();
  private readonly startOfToday = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate()).toISOString();
  private readonly startOfWeek = new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate() - this.today.getDay()).toISOString();

  async fetchRequests(): Promise<void> {
    this.isLoading.set(true);
    const { data, error } = await this.supabase.fetchQuoteRequests();
    if (!error && data) {
      this.requests.set(data);
      this.computeStats(data);
    }
    this.isLoading.set(false);
  }

  async markAsRead(id: string): Promise<{ error: string | null }> {
    const { error } = await this.supabase.markAsRead(id);
    if (!error) {
      this.requests.update((list) =>
        list.map((r) => (r.id === id ? { ...r, read: true } : r)),
      );
      this.computeStats(this.requests());
    }
    return { error };
  }

  private computeStats(data: QuoteRequestRow[]): void {
    const unread = data.filter((r) => !r.read).length;
    const today = data.filter((r) => r.created_at >= this.startOfToday).length;
    const thisWeek = data.filter((r) => r.created_at >= this.startOfWeek).length;
    this.stats.set({ total: data.length, unread, today, thisWeek });
  }
}
