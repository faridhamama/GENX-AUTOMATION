import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth.service';
import { COMPANY } from '../../../core/company.config';
import { QuoteRequestsService } from '../../../core/quote-requests.service';
import { QuoteRequestRow } from '../../../core/supabase.service';
import { ToastService } from '../../../shared/toast/toast.service';

@Component({
  selector: 'app-dashboard',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly quoteRequests = inject(QuoteRequestsService);
  private readonly fb = inject(FormBuilder);
  private readonly toast = inject(ToastService);

  readonly companyName = COMPANY.name;
  readonly user = this.auth.user;
  readonly isAuthenticated = this.auth.isAuthenticated;
  readonly isLoading = this.quoteRequests.isLoading;
  readonly requests = this.quoteRequests.requests;
  readonly stats = this.quoteRequests.stats;

  readonly searchQuery = signal('');

  readonly filteredRequests = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return this.requests();
    return this.requests().filter(
      (r) =>
        r.full_name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.project_type.toLowerCase().includes(q),
    );
  });

  readonly selectedRequest = signal<QuoteRequestRow | null>(null);

  // Login form
  readonly loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  readonly loginStatus = signal<'idle' | 'loading'>('idle');

  ngOnInit(): void {
    if (this.isAuthenticated()) {
      this.quoteRequests.fetchRequests();
    }
  }

  async onLogin(): Promise<void> {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loginStatus.set('loading');

    const { email, password } = this.loginForm.value;
    const { error } = await this.auth.signIn(email!, password!);

    if (error) {
      this.loginStatus.set('idle');
      this.toast.error('Identifiants incorrects. Veuillez réessayer.');
    } else {
      this.loginStatus.set('idle');
      this.quoteRequests.fetchRequests();
    }
  }

  selectRequest(req: QuoteRequestRow): void {
    this.selectedRequest.set(req);
  }

  closeDetail(): void {
    this.selectedRequest.set(null);
  }

  async signOut(): Promise<void> {
    await this.auth.signOut();
    this.selectedRequest.set(null);
  }

  async markAsRead(id: string): Promise<void> {
    const { error } = await this.quoteRequests.markAsRead(id);
    if (error) {
      this.toast.error();
    } else {
      this.selectedRequest.update((r) => (r?.id === id ? { ...r, read: true } : r));
    }
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
