import { ChangeDetectionStrategy, Component } from '@angular/core';

export interface ServiceCard {
  icon: string;
  number: string;
  title: string;
  category: string;
  description: string;
  spec: string;
  /** Spans two columns and displays a supplementary image */
  isWide?: boolean;
  image?: string;
  imageAlt?: string;
}

interface MethodologyStep {
  number: string;
  title: string;
  description: string;
}

interface TechStat {
  value: string;
  label: string;
  colorClass: string;
  textColorClass: string;
  isIcon?: boolean;
}

@Component({
  selector: 'app-services',
  imports: [],
  templateUrl: './services.html',
  styleUrl: './services.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Services {
  readonly serviceCards: ServiceCard[] = [
    {
      icon: 'architecture',
      number: '01',
      title: 'Study & Design',
      category: 'INGÉNIERIE',
      description:
        'Analyse fonctionnelle détaillée, architecture de réseaux industriels et conception électrique. Nous définissons le socle technique de votre automatisation.',
      spec: 'Spécifications techniques',
    },
    {
      icon: 'terminal',
      number: '02',
      title: 'PLC Programming',
      category: 'AUTOMATISATION',
      description:
        'Développement de programmes automates (Siemens, Schneider, Rockwell) optimisés pour la performance, la sécurité et la modularité.',
      spec: 'Standard IEC 61131-3',
    },
    {
      icon: 'monitoring',
      number: '03',
      title: 'SCADA Development',
      category: 'SUPERVISION',
      description:
        "Interfaces Homme-Machine (HMI) intuitives et systèmes SCADA pour un pilotage en temps réel et une historisation précise de vos données.",
      spec: 'Visualisation de données',
    },
    {
      icon: 'verified',
      number: '04',
      title: 'Commissioning & Tests',
      category: 'DÉPLOIEMENT',
      description:
        'Tests FAT/SAT rigoureux et mise en service sur site. Nous assurons une transition fluide vers la production opérationnelle.',
      spec: 'Validation de conformité',
    },
    {
      icon: 'support_agent',
      number: '05',
      title: 'Maintenance & Support',
      category: 'SUPPORT TECHNIQUE',
      description:
        'Accompagnement continu, télémaintenance et optimisation post-mise en service pour garantir la pérennité de vos installations.',
      spec: 'Disponibilité 24/7',
      isWide: true,
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAbXm5OWvhlZJYIQpRtcSIuQK-3Y0GIcyy1NIT-Y8qEA2ZSzxSu0T7Kh9xYERgGcjDCQ110PNsGx926R_CZjtVlYQEugcy1oeQIkQFfHfR_fqibQxrH2sjaDuYKCwC_egLtF_JDTUx6e8cGTTY4rS3CNzdnR6EgGKniKBgY9QwRJO3L2JlXpyj8Y7eBDHywd4m6tMF0Gc02TaC7rMcGp8G7RdfDsZCGLLibaS31D5A1SdtYSLTMO_N16m3LDhfS5IZnlEWs71xroS4',
      imageAlt: 'High-tech circuit board with glowing blue indicator lights',
    },
  ];

  readonly methodologySteps: MethodologyStep[] = [
    {
      number: '01',
      title: 'Analyse',
      description: 'Étude des besoins, cahier des charges technique et faisabilité industrielle.',
    },
    {
      number: '02',
      title: 'Conception',
      description: "Design de l'architecture logicielle et schémas électriques détaillés.",
    },
    {
      number: '03',
      title: 'Développement',
      description: 'Codage des automates et configuration des systèmes de supervision.',
    },
    {
      number: '04',
      title: 'Tests',
      description: "Validation en atelier (FAT) et vérification des protocoles de sécurité.",
    },
    {
      number: '05',
      title: 'Mise en service',
      description: "Installation sur site (SAT), formation des opérateurs et transfert.",
    },
  ];

  readonly techStats: TechStat[] = [
    {
      value: 'settings_input_component',
      label: '',
      colorClass: 'bg-surface-container-highest',
      textColorClass: 'text-outline-variant',
      isIcon: true,
    },
    {
      value: '100%',
      label: 'Précision',
      colorClass: 'bg-primary',
      textColorClass: 'text-on-primary',
    },
    {
      value: '24/7',
      label: 'Support',
      colorClass: 'bg-tertiary-container',
      textColorClass: 'text-on-tertiary-container',
    },
    {
      value: 'precision_manufacturing',
      label: '',
      colorClass: 'bg-surface-container',
      textColorClass: 'text-outline-variant',
      isIcon: true,
    },
  ];
}
