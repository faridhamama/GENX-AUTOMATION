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
      value: '100%',
      label: 'Sur Mesure',
      description: 'Algorithmes et architectures développés spécifiquement pour vos flux.',
    },
    {
      value: '24/7',
      label: 'Fiabilité',
      description: 'Systèmes conçus pour une disponibilité maximale sans compromis.',
    },
    {
      value: 'I4.0',
      label: 'Digitalisation',
      description: "Intégration transparente de l'IoT et de l'analyse de données temps réel.",
    },
    {
      value: 'UX',
      label: 'Interface',
      description: 'HMI ergonomiques pour un contrôle intuitif et sécurisé.',
    },
  ];

  readonly companyValues: CompanyValue[] = [
    {
      icon: 'precision_manufacturing',
      title: 'Précision Absolute',
      description:
        "Dans l'automatisation, l'erreur n'est pas une option. Nous appliquons des protocoles de test rigoureux à chaque étape de la conception.",
    },
    {
      icon: 'settings_input_component',
      title: 'Innovation Pragmatique',
      description:
        "Nous n'innovons pas pour le plaisir de la nouveauté, mais pour apporter une valeur ajoutée mesurable à vos processus de production.",
    },
    {
      icon: 'handshake',
      title: 'Engagement Durable',
      description:
        'Votre succès est le nôtre. Nous bâtissons des partenariats à long terme basés sur la transparence et le support technique continu.',
    },
  ];
}
