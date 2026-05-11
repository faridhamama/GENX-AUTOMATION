import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { CompanyInfoService } from '../../core/company-info.service';

@Component({
  selector: 'app-services',
  imports: [],
  templateUrl: './services.html',
  styleUrl: './services.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Services implements OnInit {
  private readonly companyInfo = inject(CompanyInfoService);

  readonly services = this.companyInfo.services;

  readonly heroLabel = computed(() => this.companyInfo.servicesPageHero()?.label ?? 'GENX AUTOMATION');
  readonly heroHeadline = computed(() => this.companyInfo.servicesPageHero()?.headline ?? "De l'idée à la <span class=\"text-outline-variant\">mise en service</span>");
  readonly heroBody = computed(() => this.companyInfo.servicesPageHero()?.body ?? "Nous couvrons l'ensemble de la chaîne : étude, conception, programmation, supervision et mise en service. Un interlocuteur unique, de A à Z.");

  readonly methodologySectionLabel = computed(() => this.companyInfo.servicesMethodology()?.section_label ?? 'Comment nous travaillons');
  readonly methodologyHeadline = computed(() => this.companyInfo.servicesMethodology()?.headline ?? 'Notre Processus');
  readonly methodologySubtext = computed(() => this.companyInfo.servicesMethodology()?.subtext ?? 'Transparence à chaque étape');

  readonly methodologySteps = computed(() =>
    this.companyInfo.methodologySteps().map(s => ({
      number: String(s.step_number).padStart(2, '0'),
      title: s.title,
      description: s.description,
    }))
  );

  ngOnInit(): void {
    this.companyInfo.fetchServices();
    this.companyInfo.fetchServicesContent();
  }
}
