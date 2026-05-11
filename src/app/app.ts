import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/auth.service';
import { SeoService } from './core/seo.service';
import { CompanyInfoService } from './core/company-info.service';
import { Navbar } from './shared/navbar/navbar';
import { Footer } from './shared/footer/footer';
import { Toast } from './shared/toast/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer, Toast],
  template: `
    <app-navbar />
    <router-outlet />
    <app-footer />
    <app-toast />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App implements OnInit {
  private readonly _auth = inject(AuthService);
  private readonly _seo = inject(SeoService);
  private readonly _companyInfo = inject(CompanyInfoService);

  ngOnInit(): void {
    this._seo.init();
    this._companyInfo.fetchCompanyInfo();
  }
}
