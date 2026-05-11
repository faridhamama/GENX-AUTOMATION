import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
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
  private readonly companyInfo = inject(CompanyInfoService);

  readonly services = this.companyInfo.services;
  readonly companyValues = this.companyInfo.companyValues;

  // Hero
  readonly heroLabel = computed(() => this.companyInfo.aboutHero()?.label ?? 'Automation & Industrial Engineering');
  readonly heroHeadline = computed(() => this.companyInfo.aboutHero()?.headline ?? 'GENX AUTOMATION');
  readonly heroBody = computed(() => this.companyInfo.aboutHero()?.body ?? "Solutions complètes d'automatisme industriel, de génie électrique et de supervision au Maroc.");

  // Availability
  readonly availLabel = computed(() => this.companyInfo.aboutAvailability()?.label ?? 'Disponibilité');
  readonly availDays = computed(() => this.companyInfo.aboutAvailability()?.days ?? 'Lundi - Vendredi');
  readonly availHours = computed(() => this.companyInfo.aboutAvailability()?.hours ?? '08:00 - 18:00');

  // Mission
  readonly missionLabel = computed(() => this.companyInfo.aboutMission()?.label ?? 'Notre Mission');
  readonly missionQuote = computed(() => this.companyInfo.aboutMission()?.quote ?? "Offrir aux industriels marocains des solutions d'automatisation complètes, fiables et adaptées à leurs besoins réels — de la conception à la mise en service.");

  // Company description
  readonly companyBody = computed(() => this.companyInfo.aboutCompany()?.body ?? "De la conception à la mise en service, GENX AUTOMATION accompagne ses clients avec rigueur et transparence. Une discipline forgée par des années d'expérience terrain sur des sites où la précision est une nécessité absolue.");

  // Services section
  readonly servicesSectionHeadline = computed(() => this.companyInfo.aboutServicesSection()?.headline ?? 'Nos Services');
  readonly servicesSectionSubtext = computed(() => this.companyInfo.aboutServicesSection()?.subtext ?? "Un accompagnement complet, de l'étude à la mise en service.");

  // Values section
  readonly valuesSectionHeadline = computed(() => this.companyInfo.aboutValuesSection()?.headline ?? 'Nos Engagements');
  readonly valuesSectionSubtext = computed(() => this.companyInfo.aboutValuesSection()?.subtext ?? 'Pas de formule magique. Juste de la rigueur, de la transparence, et une volonté permanente de bien faire.');

  // CTA section
  readonly ctaHeadline = computed(() => this.companyInfo.aboutCtaSection()?.headline ?? 'Prêt à discuter de votre projet ?');
  readonly ctaSubtext = computed(() => this.companyInfo.aboutCtaSection()?.subtext ?? "Un appel suffit pour voir si on peut travailler ensemble.");
  readonly ctaPrimaryLabel = computed(() => this.companyInfo.aboutCtaSection()?.cta_primary_label ?? 'Discuter de votre projet');
  readonly ctaPrimaryLink = computed(() => this.companyInfo.aboutCtaSection()?.cta_primary_link ?? '/contact');
  readonly ctaSecondaryLabel = computed(() => this.companyInfo.aboutCtaSection()?.cta_secondary_label ?? 'Voir nos références');
  readonly ctaSecondaryLink = computed(() => this.companyInfo.aboutCtaSection()?.cta_secondary_link ?? '/references');

  // Images
  readonly controlPanelUrl = computed(() => {
    return this.companyInfo.aboutImagesMap()['controlPanel']?.url ?? IMAGES.about.controlPanel;
  });

  ngOnInit(): void {
    this.companyInfo.fetchServices();
    this.companyInfo.fetchCompanyValues();
    this.companyInfo.fetchAboutContent();
  }
}