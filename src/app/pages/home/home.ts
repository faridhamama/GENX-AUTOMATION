import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IMAGES } from '../../core/images.config';

interface HeroStat {
  label: string;
  value: string;
  sub: string;
  accentClass: string;
}

interface ExpertiseFeature {
  text: string;
}

interface ExpertiseCard {
  icon: string;
  category: string;
  title: string;
  description: string;
  features?: ExpertiseFeature[];
  link?: string;
}

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  readonly images = IMAGES.home;

  readonly heroStats: HeroStat[] = [
    {
      label: 'Projets Livrés',
      value: '6',
      sub: 'Référencés',
      accentClass: 'bg-tertiary',
    },
    {
      label: 'Qualité Certifiée',
      value: '100%',
      sub: 'Engagement',
      accentClass: 'bg-tertiary-container',
    },
  ];

  readonly scadaFeatures: ExpertiseFeature[] = [
    { text: 'Supervision Multi-sites' },
    { text: 'Rapports Automatisés' },
  ];
}
