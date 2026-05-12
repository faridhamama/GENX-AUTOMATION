import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QuoteRequestsService } from '../../../core/quote-requests.service';
import { ToastService } from '../../../shared/toast/toast.service';
import type { QuoteRequestRow } from '../../../core/supabase.service';

@Component({
  selector: 'app-email-editor',
  imports: [FormsModule],
  templateUrl: './email-editor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailEditorComponent implements OnInit {
  readonly quoteRequests = inject(QuoteRequestsService);
  readonly toast = inject(ToastService);

  readonly searchQuery = signal('');
  readonly selectedRequest = signal<QuoteRequestRow | null>(null);

  readonly filteredRequests = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return this.quoteRequests.requests();
    return this.quoteRequests.requests().filter(
      (r) =>
        r.full_name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.project_type.toLowerCase().includes(q),
    );
  });

  ngOnInit(): void {
    this.quoteRequests.fetchRequests();
  }

  selectRequest(req: QuoteRequestRow): void {
    this.selectedRequest.set(req);
  }

  closeDetail(): void {
    this.selectedRequest.set(null);
  }

  async markAsRead(id: string): Promise<void> {
    await this.quoteRequests.markAsRead(id);
    this.toast.success('Demande marquee comme lue');
    this.selectedRequest.update((r) => r?.id === id ? { ...r, read: true } : r);
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}