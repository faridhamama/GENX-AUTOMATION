import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly supabase = inject(SupabaseService);
  private readonly router = inject(Router);

  private readonly _user = signal<{ id: string; email?: string } | null>(null);
  private readonly _isLoading = signal(true);

  readonly user = this._user.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly isAuthenticated = computed(() => this._user() !== null);

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    // Restore session from localStorage (Supabase client does this automatically)
    this.supabase.client.auth.getSession().then(({ data }) => {
      const session = data.session as { user: { id: string; email?: string } } | null;
      this._user.set(session?.user ?? null);
      this._isLoading.set(false);
    });

    // Keep signal in sync with future auth events
    this.supabase.onAuthStateChange((_event, session) => {
      const sess = session as { user: { id: string; email?: string } } | null;
      this._user.set(sess?.user ?? null);
      this._isLoading.set(false);
    });
  }

  async signIn(email: string, password: string): Promise<{ error: string | null }> {
    return this.supabase.signIn(email, password);
  }

  async signOut(): Promise<void> {
    await this.supabase.signOut();
    this._user.set(null);
    this.router.navigate(['/admin']);
  }
}
