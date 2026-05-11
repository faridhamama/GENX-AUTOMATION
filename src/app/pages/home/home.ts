import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CompanyInfoService } from '../../core/company-info.service';
import { IMAGES } from '../../core/images.config';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home implements OnInit {
  private readonly companyInfo = inject(CompanyInfoService);

  // Homepage hero content
  readonly heroBadge = computed(() => this.companyInfo.homepageHeroContent()?.hero_badge ?? "Casablanca, Maroc — Intervention nationale");
  readonly heroHeadline = computed(() => this.companyInfo.homepageHeroContent()?.hero_headline ?? "L'ingénierie qui <br>connecte l'industrie de demain");
  readonly heroBody = computed(() => this.companyInfo.homepageHeroContent()?.hero_body ?? "Je conçois et mets en service des systèmes d'automatisation industrielle, de traitement des eaux et de télégestion — avec la rigueur de quelqu'un qui a passé <strong>5 ans sur le terrain</strong>.");
  readonly ctaPrimaryLabel = computed(() => this.companyInfo.homepageHeroContent()?.cta_primary_label ?? 'Parlons de votre projet');
  readonly ctaSecondaryLabel = computed(() => this.companyInfo.homepageHeroContent()?.cta_secondary_label ?? 'Mes références');
  readonly statsImageCaption = computed(() => this.companyInfo.homepageHeroContent()?.stats_image_caption ?? 'Matériel de Précision');

  // Expertise section
  readonly expertiseLabel = computed(() => this.companyInfo.homepageHeroContent()?.expertise_label ?? 'Mon Expertise');
  readonly expertiseHeadline = computed(() => this.companyInfo.homepageHeroContent()?.expertise_headline ?? "Ce que je maîtrise<br>sur le bout des doigts");
  readonly expertiseSubtext = computed(() => this.companyInfo.homepageHeroContent()?.expertise_subtext ?? "Pas de solutions génériques. Chaque projet est unique, et ma réflexion part toujours du processus métier.");

  // CTA section
  readonly ctaSectionHeadline = computed(() => this.companyInfo.homepageHeroContent()?.cta_section_headline ?? 'Un projet en tête ?');
  readonly ctaSectionBody = computed(() => this.companyInfo.homepageHeroContent()?.cta_section_body ?? 'Discutons de votre besoin. Je vous réponds sous 24h.');
  readonly ctaSectionLabel = computed(() => this.companyInfo.homepageHeroContent()?.cta_section_label ?? 'Me contacter');

  readonly heroStats = computed<{label: string; value: string; sub: string; accentClass: string}[]>(() => {
    if (!stats) return [];
    return [
      { label: stats.stat1_label, value: stats.stat1_value, sub: stats.stat1_sub, accentClass: stats.stat1_accent_class },
      { label: stats.stat2_label, value: stats.stat2_value, sub: stats.stat2_sub, accentClass: stats.stat2_accent_class },
    ];
  });

  readonly expertiseCards = computed<{id: string; icon: string; title: string; description: string; tags: string[]}[]>(() =>
    this.companyInfo.homepageExpertiseCards(),
  );

  readonly images = computed(() => {
    const imgs = this.companyInfo.homepageImages();
    const findImg = (key: string) => imgs.find(i => i.image_key === key);
    return {
      heroBg: findImg('heroBg')?.url || IMAGES.home.heroBg,
      circuitBoard: findImg('circuitBoard')?.url || IMAGES.home.circuitBoard,
      industrialLine: findImg('industrialLine')?.url || IMAGES.home.industrialLine,
      iotRouter: findImg('iotRouter')?.url || IMAGES.home.iotRouter,
    };
  });

  ngOnInit(): void {
    this.companyInfo.fetchHomepageContent();
    this.companyInfo.fetchHomepageHeroContent();
  }
}