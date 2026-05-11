import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CompanyInfoService } from '../../core/company-info.service';

@Component({
  selector: 'app-services',
  imports: [],
  templateUrl: './services.html',
  styleUrl: './services.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Services implements OnInit {
  private readonly companyInfoService = inject(CompanyInfoService);

  readonly services = this.companyInfoService.services;

  readonly methodologySteps = [
    {
      number: '01',
      title: 'Échange',
      description: 'Nous comprenons votre processus, vos contraintes, vos objectifs. Sans cette base, rien ne tient.',
    },
    {
      number: '02',
      title: 'Conception',
      description: 'Architecture système, choix technologiques, planification. Tout est défini avant la première ligne de code.',
    },
    {
      number: '03',
      title: 'Développement',
      description: "Programmation, configuration, tests en atelier. Nous vous tenons informé à chaque étape.",
    },
    {
      number: '04',
      title: 'Validation',
      description: 'Tests sur site (SAT), calibration, mise au point. Rien ne part en production sans validation.',
    },
    {
      number: '05',
      title: 'Livraison',
      description: 'Documentation complète, formation de vos équipes, et nous restons disponibles en cas de besoin.',
    },
  ];

  ngOnInit(): void {
    this.companyInfoService.fetchServices();
  }
}
