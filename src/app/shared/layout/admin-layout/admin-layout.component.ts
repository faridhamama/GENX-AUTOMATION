import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/auth.service';
import { QuoteRequestsService } from '../../../core/quote-requests.service';
import { COMPANY } from '../../../core/company.config';
import { EmailEditorComponent } from '../../../features/admin/email-editor/email-editor.component';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterLink, FormsModule, EmailEditorComponent],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminLayoutComponent implements OnInit {
  private readonly auth = inject(AuthService);
  readonly quoteRequests = inject(QuoteRequestsService);

  readonly companyName = COMPANY.name;
  readonly user = this.auth.user;
  readonly isAuthenticated = this.auth.isAuthenticated;

  loginEmail = '';
  loginPassword = '';

  ngOnInit(): void {
    if (this.isAuthenticated()) {
      this.quoteRequests.fetchRequests();
    }
  }

  async onLogin(): Promise<void> {
    if (!this.loginEmail || !this.loginPassword) return;
    const { error } = await this.auth.signIn(this.loginEmail, this.loginPassword);
    if (!error) {
      this.quoteRequests.fetchRequests();
    }
  }

  async signOut(): Promise<void> {
    await this.auth.signOut();
  }
}