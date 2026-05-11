import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CompanyInfoService } from '../../core/company-info.service';
import { IMAGES } from '../../core/images.config';

@Component({
  selector: 'app-about',
  imports: [RouterLink],
  templateUrl: './about.html',
  styleUrl: './about.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class About implements OnInit {
  private readonly companyInfoService = inject(CompanyInfoService);

  readonly images = IMAGES.about;
  readonly services = this.companyInfoService.services;
  readonly companyValues = this.companyInfoService.companyValues;

  ngOnInit(): void {
    this.companyInfoService.fetchServices();
    this.companyInfoService.fetchCompanyValues();
  }
}