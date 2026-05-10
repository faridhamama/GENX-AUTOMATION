import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IMAGES } from '../../core/images.config';

interface Service {
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

  readonly services: Service[] = [
    {
      label: 'Assistance technique & formation',
      description: 'Conseil, audits, études de faisabilité, formation du personnel technique, AMO dans l\'automatisme et l\'électricité industrielle',
    },
    {
      label: 'Automatisme industriel',
      description: 'Programmation and mise en service d\'automates (PLC) — toute marque et technologie',
    },
    {
      label: 'Génie électrique (BT/MT)',
      description: 'Études, fourniture, installation et mise en service — tableaux électriques, armoires de puissance et de commande, postes de transformation',
    },
    {
      label: 'Instrumentation industrielle',
      description: 'Fourniture, installation, étalonnage et maintenance d\'instruments de mesure, capteurs, transmetteurs, analyseurs et régulateurs',
    },
    {
      label: 'Intégration de systèmes',
      description: 'Architectures complètes, intégration de sous-systèmes, communication industrielle (Modbus, Profibus, Profinet, OPC-UA), liaison MES/ERP',
    },
    {
      label: 'Supervision (SCADA/IHM)',
      description: 'Conception, intégration et exploitation de systèmes de supervision (SCADA), interfaces homme-machine (IHM/HMI) et Topkapi, Vijeo Designer, WinCC, Ignition',
    },
    {
      label: 'Commercialisation & distribution',
      description: 'Importation et distribution de matériels, équipements, composants et logiciels relatifs à l\'automatisme industriel et l\'instrumentation',
    },
  ];

  readonly companyValues: CompanyValue[] = [
    {
      icon: 'engineering',
      title: 'Rigueur industrielle',
      description: 'Une discipline forgée par des années d\'expérience terrain sur des sites où la précision est une nécessité absolue',
    },
    {
      icon: 'handshake',
      title: 'Transparence totale',
      description: 'Offrir ce dont le client a vraiment besoin — sans surdimensionnement ni promesses impossibles à tenir',
    },
    {
      icon: 'workspace_premium',
      title: 'Savoir-faire concret',
      description: 'Du code, des schémas, des tests en situation réelle. Nous livrons ce que nous promettons',
    },
  ];
}
