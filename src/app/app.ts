import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from './core/auth.service';
import { SeoService } from './core/seo.service';
import { CompanyFacade } from './core/company.facade';
import { Navbar } from './shared/navbar/navbar';
import { Footer } from './shared/footer/footer';
import { Toast } from './shared/toast/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer, Toast],
  template: `
    <app-navbar />
    <router-outlet />
    @if (!isAdminRoute()) {
      <app-footer />
    }
    <app-toast />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App implements OnInit {
  private readonly _auth = inject(AuthService);
  private readonly _seo = inject(SeoService);
  private readonly _company = inject(CompanyFacade);
  private readonly _router = inject(Router);

  isAdminRoute = signal(false);

  ngOnInit(): void {
    this._seo.init();
    this._company.fetchCompanyInfo();
    this._router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((e: any) => {
      this.isAdminRoute.set(e.urlAfterRedirects.startsWith('/admin'));
    });
  }
}
