import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { ServicesPageFacade } from '../../core/services-page.facade';
import { CompanyFacade } from '../../core/company.facade';

@Component({
  selector: 'app-services',
  imports: [],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicesComponent implements OnInit {
  private readonly servicesPage = inject(ServicesPageFacade);
  private readonly company = inject(CompanyFacade);

  readonly services = this.company.services;

  readonly heroLabel = computed(() => this.servicesPage.servicesPageHero()?.label ?? 'GENX AUTOMATION');
  readonly heroHeadline = computed(() => this.servicesPage.servicesPageHero()?.headline ?? "De l'idée à la <span class=\"text-outline-variant\">mise en service</span>");
  readonly heroBody = computed(() => this.servicesPage.servicesPageHero()?.body ?? "Nous couvrons l'ensemble de la chaîne : étude, conception, programmation, supervision et mise en service. Un interlocuteur unique, de A à Z.");

  readonly methodologySectionLabel = computed(() => this.servicesPage.servicesMethodology()?.section_label ?? 'Comment nous travaillons');
  readonly methodologyHeadline = computed(() => this.servicesPage.servicesMethodology()?.headline ?? 'Notre Processus');
  readonly methodologySubtext = computed(() => this.servicesPage.servicesMethodology()?.subtext ?? 'Transparence à chaque étape');

  readonly methodologySteps = computed(() =>
    this.servicesPage.methodologySteps().map(s => ({
      number: String(s.step_number).padStart(2, '0'),
      title: s.title,
      description: s.description,
    }))
  );

  ngOnInit(): void {
    this.company.fetchServices();
    this.servicesPage.fetchServicesContent();
  }
}