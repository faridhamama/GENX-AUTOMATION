import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { COMPANY } from '../../core/company.config';
import { NAV_LINKS, NavLink } from '../../core/navigation.config';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Navbar {
  private readonly auth = inject(AuthService);

  readonly companyName = COMPANY.name;
  readonly menuOpen = signal(false);

  readonly navLinks = computed<NavLink[]>(() => {
    const links = [...NAV_LINKS];
    if (this.auth.isAuthenticated()) {
      links.push({ label: 'Admin', path: '/admin' });
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
