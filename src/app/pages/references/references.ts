import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReferencesFacade } from '../../core/references.facade';
import { IMAGES } from '../../core/images.config';

@Component({
  selector: 'app-references',
  imports: [RouterLink],
  templateUrl: './references.html',
  styleUrl: './references.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class References implements OnInit {
  private readonly references = inject(ReferencesFacade);

  readonly images = IMAGES.references;

  readonly heroLabel = computed(() => this.references.referencesHero()?.label ?? 'Mes Réalisations');
  readonly heroHeadline = computed(() => this.references.referencesHero()?.headline ?? 'Projets sur lesquels<br>j\'ai travaillé');
  readonly heroBody = computed(() => this.references.referencesHero()?.body ?? "Chaque projet listé ici reflète mon expérience directe. Programmation, mise en service, instrumentation, formation — je suis intervenu de bout en bout ou sur des phases spécifiques, selon les besoins.");

  readonly featuredProject = computed(() => this.references.referencesFeaturedProject());
  readonly featuredProjectSpecs = computed(() => {
    const fp = this.featuredProject();
    if (!fp) return [];
    try { return JSON.parse(fp.specs_json) as { label: string; value: string }[]; } catch { return []; }
  });
  readonly featuredProjectImageUrl = computed(() => {
    const fp = this.featuredProject();
    if (!fp) return IMAGES.references.featuredProject;
    return this.references.referencesImagesMap()[fp.image_key]?.url ?? IMAGES.references.featuredProject;
  });

  readonly performanceStats = computed(() => this.references.referencesPerformanceStats());
  readonly sideProjects = computed(() => this.references.referencesSideProjects());
  readonly qualityPoints = computed(() => this.references.referencesQualityPoints());
  readonly qualitySectionImageUrl = computed(() => {
    return this.references.referencesImagesMap()['serverRoom']?.url ?? IMAGES.references.serverRoom;
  });

  ngOnInit(): void {
    this.references.fetchReferencesContent();
  }
}