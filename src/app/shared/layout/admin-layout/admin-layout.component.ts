import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/auth.service';
import { QuoteRequestsService } from '../../../core/quote-requests.service';
import { COMPANY } from '../../../core/company.config';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterLink, RouterOutlet, FormsModule],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminLayoutComponent {
  private readonly auth = inject(AuthService);
  readonly quoteRequests = inject(QuoteRequestsService);
  private readonly router = inject(Router);

  readonly companyName = COMPANY.name;
  readonly user = this.auth.user;
  readonly isAuthenticated = this.auth.isAuthenticated;

  loginEmail = '';
  loginPassword = '';

  async onLogin(): Promise<void> {
    if (!this.loginEmail || !this.loginPassword) return;
    const { error } = await this.auth.signIn(this.loginEmail, this.loginPassword);
    if (!error) {
      this.quoteRequests.fetchRequests();
      this.router.navigate(['/admin/emails']);
    }
  }

  async signOut(): Promise<void> {
    await this.auth.signOut();
    this.router.navigate(['/']);
  }

  navigateTo(section: string): void {
    this.router.navigate(['/admin', section]);
  }
}