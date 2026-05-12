import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SeoService } from './core/seo.service';
import { CompanyFacade } from './core/company.facade';
import { Navbar } from './shared/navbar/navbar';
import { Footer } from './shared/footer/footer';
import { Toast } from './shared/toast/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer, Toast],
  template: `
    @if (isReady()) {
      <app-navbar />
      <router-outlet />
      @if (!isAdminRoute()) {
        <app-footer />
      }
      <app-toast />
    } @else {
      <div class="initial-loader">
        <div class="loader-content">
          <img src="GENX AUTOMATION FAVICON.svg" alt="GENX AUTOMATION" class="loader-logo" />
          <div class="loader-bar">
            <div class="loader-progress"></div>
          </div>
          <p class="loader-text">Chargement...</p>
        </div>
      </div>
    }
  `,
  styles: [`
    .initial-loader {
      position: fixed;
      inset: 0;
      z-index: 9999;
      background: #f7f9fb;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .loader-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
    }
    .loader-logo {
      width: 4rem;
      height: auto;
      animation: pulse 1.5s ease-in-out infinite;
    }
    .loader-bar {
      width: 12rem;
      height: 3px;
      background: #e0e0e0;
      border-radius: 9999px;
      overflow: hidden;
    }
    .loader-progress {
      height: 100%;
      background: #91de672e;
      border-radius: 9999px;
      animation: load 1.2s ease-in-out infinite;
    }
    .loader-text {
      font-family: 'Space Grotesk', sans-serif;
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: #91de672e;
    }
    @keyframes load {
      0% { width: 0%; margin-left: 0; }
      50% { width: 60%; margin-left: 20%; }
      100% { width: 0%; margin-left: 100%; }
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.7; transform: scale(0.95); }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App implements OnInit {
  private readonly _seo = inject(SeoService);
  private readonly _company = inject(CompanyFacade);
  private readonly _router = inject(Router);

  isReady = signal(false);
  isAdminRoute = signal(false);

  ngOnInit(): void {
    this._seo.init();
    this._company.fetchCompanyInfo().finally(() => this.isReady.set(true));

    this._router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((e: any) => {
      this.isAdminRoute.set(e.urlAfterRedirects.startsWith('/admin'));
    });
  }
}
