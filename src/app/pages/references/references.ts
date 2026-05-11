import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CompanyInfoService } from '../../core/company-info.service';
import { IMAGES } from '../../core/images.config';

@Component({
  selector: 'app-references',
  imports: [RouterLink],
  templateUrl: './references.html',
  styleUrl: './references.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class References implements OnInit {
  private readonly companyInfo = inject(CompanyInfoService);

  readonly images = IMAGES.references;

  readonly heroLabel = computed(() => this.companyInfo.referencesHero()?.label ?? 'Mes Réalisations');
  readonly heroHeadline = computed(() => this.companyInfo.referencesHero()?.headline ?? 'Projets sur lesquels<br>j\'ai travaillé');
  readonly heroBody = computed(() => this.companyInfo.referencesHero()?.body ?? "Chaque projet listé ici reflète mon expérience directe. Programmation, mise en service, instrumentation, formation — je suis intervenu de bout en bout ou sur des phases spécifiques, selon les besoins.");

  readonly featuredProject = computed(() => this.companyInfo.referencesFeaturedProject());
  readonly featuredProjectSpecs = computed(() => {
    const fp = this.featuredProject();
    if (!fp) return [];
    try { return JSON.parse(fp.specs_json) as { label: string; value: string }[]; } catch { return []; }
  });
  readonly featuredProjectImageUrl = computed(() => {
    const fp = this.featuredProject();
    if (!fp) return IMAGES.references.featuredProject;
    return this.companyInfo.referencesImagesMap()[fp.image_key]?.url ?? IMAGES.references.featuredProject;
  });

  readonly performanceStats = computed(() => this.companyInfo.referencesPerformanceStats());
  readonly sideProjects = computed(() => this.companyInfo.referencesSideProjects());
  readonly qualityPoints = computed(() => this.companyInfo.referencesQualityPoints());
  readonly qualitySectionImageUrl = computed(() => {
    return this.companyInfo.referencesImagesMap()['serverRoom']?.url ?? IMAGES.references.serverRoom;
  });

  ngOnInit(): void {
    this.companyInfo.fetchReferencesContent();
  }
}
