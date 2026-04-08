import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IMAGES } from '../../core/images.config';

interface Capability {
  value: string;
  label: string;
  description: string;
}

interface CompanyValue {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-about',
  imports: [RouterLink],
  templateUrl: './about.html',
  styleUrl: './about.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class About {
  readonly images = IMAGES.about;

  readonly capabilities: Capability[] = [
    {
      value: '10+',
      label: 'Années Terrain',
      description: "Des années sur le terrain, pas dans un bureau. Chaque projet m'a appris quelque chose qu'aucun manuel ne couvre.",
    },
    {
      value: 'Multi',
      label: 'Marques PLC',
      description: "Schneider, Siemens, Allen Bradley — je ne me ferme aucune porte. Le bon outil pour chaque situation.",
    },
    {
      value: 'I4.0',
      label: 'Vision IT/OT',
      description: "Je ne suis pas qu'automaticien. Je comprends aussi l'informatique industrielle et la convergence IT/OT.",
    },
    {
      value: 'Terrain',
      label: 'Pragmatique',
      description: "Pas de surengineering. Je conçois des systèmes simples, maintenables, et qui fonctionnent en conditions réelles.",
    },
  ];

  readonly companyValues: CompanyValue[] = [
    {
      icon: 'engineering',
      title: 'Rigueur sur le terrain',
      description:
        "J'ai travaillé sur des sites où une erreur de programme signifie un arrêt de production. Cette réalité forge une discipline que j'applique à chaque projet.",
    },
    {
      icon: 'handshake',
      title: 'Transparence totale',
      description:
        "Si votre projet n'est pas adapté à une solution que je maîtrise, je vous le dis. Je ne vends pas ce que je ne connais pas.",
    },
    {
      icon: 'workspace_premium',
      title: 'Savoir-faire concret',
      description:
        "Pas de PowerPoint. Du code, des schémas, des tests en situation réelle. C'est ainsi que je fonctionne.",
    },
  ];
}
