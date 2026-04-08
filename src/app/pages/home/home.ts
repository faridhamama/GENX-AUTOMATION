import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IMAGES } from '../../core/images.config';

interface ExpertiseCard {
  icon: string;
  title: string;
  description: string;
  tags: string[];
  cta?: string;
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

  readonly heroStats: { label: string; value: string; sub: string; accentClass: string }[] = [
    { label: 'Années d\'expérience terrain', value: '5+', sub: 'En industrie', accentClass: 'bg-tertiary' },
    { label: 'Taux de satisfaction client', value: '100%', sub: 'Clients accompagnés', accentClass: 'bg-tertiary-container' },
  ];

  readonly expertiseCards: ExpertiseCard[] = [
    {
      icon: 'precision_manufacturing',
      title: 'Automatisation Industrielle',
      description:
        "Après des années à programmer, mettre en service et diagnostiquer des systèmes sur site, je conçois des architectures qui fonctionnent — vraiment. Automates, armoires, capteurs : chaque pièce est pensée pour durer.",
      tags: ['Schneider M580 / M340 / M221', 'Siemens TIA Portal', 'Allen Bradley', 'IEC 61131-3'],
    },
    {
      icon: 'monitoring',
      title: 'Supervision SCADA & HMI',
      description:
        "Une interface mal pensée, c'est un opérateur perdu. Je développe des IHM claires, ergonomiques, avec une gestion d'alarmes qui respecte vraiment le métier du client.",
      tags: ['Topkapi SCADA', 'PcVue', 'Vijeo Designer', 'WinCC'],
    },
    {
      icon: 'water_drop',
      title: 'Traitement des Eaux',
      description:
        "C'est mon domaine de prédilection. Stations d'épuration, adduction potable, dessalement — je connais les processus hydrauliques autant que l'automatique qui les pilote.",
      tags: ['STEP / AEP', 'Dessalement', 'Régulation PID', 'Topkapi / PcVue'],
    },
    {
      icon: 'router',
      title: 'Télégestion & Réseaux',
      description:
        "Routeurs Teltonika, automates Sofrel, protocoles Modbus TCP/IP et RTU — je maîtrise la chaîne de communication industrielle de bout en bout, du terrain jusqu'au superviseur distant.",
      tags: ['Teltonika RUT956', 'Sofrel S500', 'Modbus TCP/IP', 'Modbus RTU'],
    },
  ];
}
