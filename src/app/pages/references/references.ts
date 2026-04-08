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
    sector: 'Hydraulique & Eau',
    title: "AEP Smir: Adduction d'Eau Potable",
    technology: 'M580 PLC',
    techLabel: 'Technologie de Pointe',
    specs: [
      { label: 'Automate', value: 'Schneider Modicon M580' },
      { label: 'Communication', value: 'Ethernet/IP & Modbus TCP' },
      { label: 'Supervision', value: 'Vijeo Citect SCADA' },
    ],
    image: IMAGES.references.featuredProject,
    imageAlt: 'PLC control panel with colorful glowing status lights in an industrial setting',
    result:
      "Optimisation du flux hydraulique avec une réduction de 15% de la consommation énergétique des pompes via un contrôle PID précis.",
  };

  readonly performanceStats: PerformanceStat[] = [
    { value: '42+', label: 'Projets Livrés' },
    { value: '99.9%', label: 'Uptime Système' },
  ];

  readonly sideProjects: SideProject[] = [
    {
      sector: 'Automobile • Robotique',
      title: "Ligne d'Assemblage Châssis",
      description:
        "Intégration de bras robotisés Fanuc avec PLC Siemens S7-1500 pour une synchronisation millimétrée.",
      keySpec: 'Profinet IRT / Safety Integrated',
    },
    {
      sector: 'Énergie • Smart Grid',
      title: 'Supervision Parc Solaire',
      description:
        "Monitoring temps réel de 500 onduleurs avec protocole IEC 60870-5-104 et stockage de données InfluxDB.",
      keySpec: 'SCADA Ignition / MQTT',
    },
    {
      sector: 'Agroalimentaire',
      title: 'Système de Pesage Industriel',
      description:
        "Modernisation d'une unité de pesage avec pesons numériques et interface HMI tactile haute résolution.",
      keySpec: 'Allen Bradley CompactLogix',
    },
  ];

  readonly qualityPoints: QualityPoint[] = [
    {
      icon: 'verified',
      title: 'Expertise Native',
      description: "Conçu par des ingénieurs ayant passé des milliers d'heures en usine.",
    },
    {
      icon: 'settings_input_component',
      title: 'Architecture Modulaire',
      description: "Code propre, documenté et prêt pour l'Industrie 4.0.",
    },
  ];
}
