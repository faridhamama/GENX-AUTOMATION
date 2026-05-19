import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SeoService } from './core/seo.service';
import { CompanyFacade } from './core/company.facade';
import { Navbar } from './shared/navbar/navbar';
import { Footer } from './shared/footer/footer';
import { Toast } from './shared/toast/toast';
import { LoaderComponent } from './shared/loader/loader.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer, Toast, LoaderComponent],
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
          <span class="loader-wordmark">GenX Automation</span>
          <app-loader size="md" label="Chargement" />
        </div>
      </div>
    }
  `,
  styles: [`
    .initial-loader {
      position: fixed;
      inset: 0;
      z-index: 9999;
      background: linear-gradient(135deg, var(--color-surface) 0%, var(--color-surface-container-low) 100%);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .loader-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2.5rem;
    }
    .loader-logo {
      width: 4.5rem;
      height: auto;
      animation: logo-float 3s ease-in-out infinite;
      filter: drop-shadow(0 4px 12px rgba(0, 124, 124, 0.15));
    }
    .loader-wordmark {
      font-family: var(--font-headline);
      font-size: 0.7rem;
      font-weight: 700;
      letter-spacing: 0.35em;
      text-transform: uppercase;
      color: var(--color-primary);
      margin-top: -0.5rem;
    }
    @keyframes logo-float {
      0%, 100% { transform: translateY(0) scale(1); opacity: 1; }
      50% { transform: translateY(-6px) scale(1.02); opacity: 0.85; }
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

    Promise.race([
      this._company.fetchCompanyInfo(),
      new Promise(resolve => setTimeout(resolve, 5000)),
    ]).finally(() => this.isReady.set(true));

    this._router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((e: any) => {
      this.isAdminRoute.set(e.urlAfterRedirects.startsWith('/admin'));
    });
  }
}
