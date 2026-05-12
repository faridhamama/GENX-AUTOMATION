import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AboutFacade } from '../../core/about.facade';
import { CompanyFacade } from '../../core/company.facade';
import { IMAGES } from '../../core/images.config';

@Component({
  selector: 'app-about',
  imports: [RouterLink],
  templateUrl: './about.html',
  styleUrl: './about.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class About implements OnInit {
  private readonly about = inject(AboutFacade);
  private readonly company = inject(CompanyFacade);

  readonly services = this.company.services;
  readonly companyValues = this.company.companyValues;

  // Hero
  readonly heroLabel = computed(() => this.about.aboutHero()?.label ?? 'Automation & Industrial Engineering');
  readonly heroHeadline = computed(() => this.about.aboutHero()?.headline ?? 'GENX AUTOMATION');
  readonly heroBody = computed(() => this.about.aboutHero()?.body ?? "Solutions complètes d'automatisme industriel, de génie électrique et de supervision au Maroc.");

  // Availability
  readonly availLabel = computed(() => this.about.aboutAvailability()?.label ?? 'Disponibilité');
  readonly availDays = computed(() => this.about.aboutAvailability()?.days ?? 'Lundi - Vendredi');
  readonly availHours = computed(() => this.about.aboutAvailability()?.hours ?? '08:00 - 18:00');

  // Mission
  readonly missionLabel = computed(() => this.about.aboutMission()?.label ?? 'Notre Mission');
  readonly missionQuote = computed(() => this.about.aboutMission()?.quote ?? "Offrir aux industriels marocains des solutions d'automatisation complètes, fiables et adaptées à leurs besoins réels — de la conception à la mise en service.");

  // Company description
  readonly companyBody = computed(() => this.about.aboutCompany()?.body ?? "De la conception à la mise en service, GENX AUTOMATION accompagne ses clients avec rigueur et transparence. Une discipline forgée par des années d'expérience terrain sur des sites où la précision est une nécessité absolue.");

  // Services section
  readonly servicesSectionHeadline = computed(() => this.about.aboutServicesSection()?.headline ?? 'Nos Services');
  readonly servicesSectionSubtext = computed(() => this.about.aboutServicesSection()?.subtext ?? "Un accompagnement complet, de l'étude à la mise en service.");

  // Values section
  readonly valuesSectionHeadline = computed(() => this.about.aboutValuesSection()?.headline ?? 'Nos Engagements');
  readonly valuesSectionSubtext = computed(() => this.about.aboutValuesSection()?.subtext ?? 'Pas de formule magique. Juste de la rigueur, de la transparence, et une volonté permanente de bien faire.');

  // CTA section
  readonly ctaHeadline = computed(() => this.about.aboutCtaSection()?.headline ?? 'Prêt à discuter de votre projet ?');
  readonly ctaSubtext = computed(() => this.about.aboutCtaSection()?.subtext ?? "Un appel suffit pour voir si on peut travailler ensemble.");
  readonly ctaPrimaryLabel = computed(() => this.about.aboutCtaSection()?.cta_primary_label ?? 'Discuter de votre projet');
  readonly ctaPrimaryLink = computed(() => this.about.aboutCtaSection()?.cta_primary_link ?? '/contact');
  readonly ctaSecondaryLabel = computed(() => this.about.aboutCtaSection()?.cta_secondary_label ?? 'Voir nos références');
  readonly ctaSecondaryLink = computed(() => this.about.aboutCtaSection()?.cta_secondary_link ?? '/references');

  // Images
  readonly controlPanelUrl = computed(() => {
    return this.about.aboutImagesMap()['controlPanel']?.url ?? IMAGES.about.controlPanel;
  });

  ngOnInit(): void {
    this.company.fetchServices();
    this.company.fetchCompanyValues();
    this.about.fetchAboutContent();
  }
}