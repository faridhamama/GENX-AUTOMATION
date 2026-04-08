import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IMAGES } from '../../core/images.config';

export interface ServiceCard {
  icon: string;
  number: string;
  title: string;
  category: string;
  description: string;
  spec: string;
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
  readonly images = IMAGES.services;

  readonly serviceCards: ServiceCard[] = [
    {
      icon: 'architecture',
      number: '01',
      title: 'Étude & Conception',
      category: 'INGÉNIERIE',
      description:
        "Avant de programmer, je comprends. Analyse fonctionnelle, architecture réseau, bilan de puissance — je pose les bases solides pour que tout le reste tienne.",
      spec: 'Cahier des charges, notes de calcul, architecture',
    },
    {
      icon: 'terminal',
      number: '02',
      title: 'Programmation PLC',
      category: 'AUTOMATISATION',
      description:
        "Schneider, Siemens, Allen Bradley — peu importe la marque. Ce qui compte, c'est un code structuré, documenté et qui tient la route en production.",
      spec: 'IEC 61131-3, Grafcet, Ladder, ST',
    },
    {
      icon: 'monitoring',
      number: '03',
      title: 'Développement SCADA',
      category: 'SUPERVISION',
      description:
        "Une supervision mal conçue, c'est un opérateur qui ne comprend pas ce qui se passe. Je crée des IHM pensées pour le métier, pas pour l'automaticien.",
      spec: 'Topkapi, PcVue, Vijeo Designer, WinCC',
    },
    {
      icon: 'verified',
      number: '04',
      title: 'Mise en Service',
      category: 'DÉPLOIEMENT',
      description:
        "Être sur site, c'est là que tout se valide. Tests FAT/SAT, calibration instrument, optimisation des régulations PID — je ne pars pas avant que ça fonctionne.",
      spec: 'FAT/SAT, calibration, PID, formation',
    },
    {
      icon: 'support_agent',
      number: '05',
      title: 'Maintenance & Support',
      category: 'ACCOMPAGNEMENT',
      description:
        "Un système maintenu, c'est un système qui ne vous lâche pas. Je propose du support réactif et de la maintenance préventive.",
      spec: 'Support réactif, préventif, mises à jour',
      isWide: true,
      image: IMAGES.services.maintenance,
      imageAlt: 'Industrial maintenance engineer working on a control panel',
    },
  ];

  readonly methodologySteps: MethodologyStep[] = [
    {
      number: '01',
      title: 'Échange',
      description: "Je comprends votre processus, vos contraintes, vos objectifs. Sans cette base, rien d'autre ne tient.",
    },
    {
      number: '02',
      title: 'Conception',
      description: "Architecture système, choix technologiques, planification. Tout est défini avant la première ligne de code.",
    },
    {
      number: '03',
      title: 'Développement',
      description: "Programmation, configuration, tests en atelier. Je vous tiens informé à chaque étape.",
    },
    {
      number: '04',
      title: 'Validation',
      description: "Tests sur site (SAT), calibration, mise au point. Rien ne part en production sans validation.",
    },
    {
      number: '05',
      title: 'Livraison',
      description: "Documentation complète, formation de vos équipes, et je reste disponible en cas de besoin.",
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
      label: 'Sur Mesure',
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
