import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IMAGES } from '../../core/images.config';

export interface ProjectSpec {
  label: string;
  value: string;
}

export interface SideProject {
  sector: string;
  title: string;
  description: string;
  keySpec: string;
}

export interface FeaturedProject {
  sector: string;
  title: string;
  technology: string;
  techLabel: string;
  specs: ProjectSpec[];
  image: string;
  imageAlt: string;
  result: string;
}

interface QualityPoint {
  icon: string;
  title: string;
  description: string;
}

interface PerformanceStat {
  value: string;
  label: string;
}

@Component({
  selector: 'app-references',
  imports: [RouterLink],
  templateUrl: './references.html',
  styleUrl: './references.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class References {
  readonly images = IMAGES.references;

  readonly featuredProject: FeaturedProject = {
    sector: 'Traitement des Eaux',
    title: 'STEP Marrakech — Station d\'Épuration',
    technology: 'Schneider M580',
    techLabel: 'Automatisation Complète',
    specs: [
      { label: 'Automate', value: 'Schneider Modicon M580 & M221' },
      { label: 'Supervision', value: 'Topkapi Vision & Vijeo Designer' },
      { label: 'Télégestion', value: 'Teltonika RUT956 / Modbus TCP/IP' },
    ],
    image: IMAGES.references.featuredProject,
    imageAlt: 'PLC control panel with colorful glowing status lights in an industrial setting',
    result:
      "Automatisation complète de la station avec gestion d'alarmes en temps réel, tendances historiques et supervision distante. Le client a réduit son temps de diagnostic de 60%.",
  };

  readonly performanceStats: PerformanceStat[] = [
    { value: '42+', label: 'Projets Réalisés' },
    { value: '100%', label: 'Clients Satisfaits' },
  ];

  readonly sideProjects: SideProject[] = [
    {
      sector: 'Dessalement • Laayoune',
      title: 'Unité de Dessalement — Société Génération Maroc Technologie',
      description:
        "Mise à jour des programmes PLC M580 et M340, mise à jour de la supervision Topkapi Vision et PcVue, instrumentation et calibration. Communication Modbus RTU.",
      keySpec: 'M580 & M340 / Topkapi / PcVue / Modbus RTU',
    },
    {
      sector: "Adduction • Zagora",
      title: 'AEP Zagora — Adduction d\'Eau Potable',
      description:
        "Programmation M580, M340 et M221, supervision Topkapi Vision, mise en service complète, tests et formation à l'exploitation. Télégestion par Sofrel S500.",
      keySpec: 'M580 & M340 & M221 / Topkapi Vision / Sofrel S500',
    },
    {
      sector: 'Épuration • Bouznika',
      title: 'STEP Bouznika — Station d\'Épuration',
      description:
        "Automatisation avec architecture Schneider M340. Analyse fonctionnelle complète du processus hydraulique.",
      keySpec: 'M340 / Analyse fonctionnelle',
    },
  ];

  readonly qualityPoints: QualityPoint[] = [
    {
      icon: 'engineering',
      title: 'Pragmatique',
      description: "Chaque ligne de code est là pour une raison. Pas de complexité gratuite.",
    },
    {
      icon: 'description',
      title: 'Documenté',
      description: "Documentation à jour, schémas lisibles. Vos équipes peuvent prendre le relai.",
    },
  ];
}
