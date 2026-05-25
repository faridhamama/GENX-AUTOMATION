import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NAV_LINKS, NavLink } from '../../core/navigation.config';
import { AuthService } from '../../core/auth.service';
import { CompanyFacade } from '../../core/company.facade';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Navbar {
  private readonly auth = inject(AuthService);
  private readonly company = inject(CompanyFacade);

  readonly companyName = computed(() => this.company.companyInfo()?.company_name ?? 'GENX AUTOMATION');
  readonly menuOpen = signal(false);

  readonly navLinks = computed<NavLink[]>(() => {
    const links = [...NAV_LINKS];
    if (this.auth.isAuthenticated()) {
      links.push({ label: 'Admin', path: '/admin/emails' });
    }
    return links;
  });

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }
}