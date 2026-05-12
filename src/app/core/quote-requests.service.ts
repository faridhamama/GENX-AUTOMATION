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

  private get dateBounds() {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay()).toISOString();
    return { startOfToday, startOfWeek };
  }

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
    const { startOfToday, startOfWeek } = this.dateBounds;
    const unread = data.filter((r) => !r.read).length;
    const todayCount = data.filter((r) => r.created_at >= startOfToday).length;
    const thisWeekCount = data.filter((r) => r.created_at >= startOfWeek).length;
    this.stats.set({ total: data.length, unread, today: todayCount, thisWeek: thisWeekCount });
  }
}
