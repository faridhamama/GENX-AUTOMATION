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
      label: 'Automatisme industriel',
      description: 'Programmation et mise en service d\'automates (PLC) — toute marque et technologie',
    },
    {
      label: 'Supervision (SCADA/IHM)',
      description: 'Conception, intégration et exploitation de systèmes de supervision et interfaces homme-machine',
    },
    {
      label: 'Génie électrique (BT/MT)',
      description: 'Études, fourniture, installation et mise en service — tableaux électriques, armoires, postes de transformation',
    },
    {
      label: 'Instrumentation industrielle',
      description: 'Fourniture, installation, étalonnage et maintenance d\'instruments de mesure et capteurs',
    },
    {
      label: 'Intégration de systèmes',
      description: 'Architectures complètes, communication industrielle (Modbus, Profibus, Profinet, OPC-UA), liaison MES/ERP',
    },
    {
      label: 'Assistance technique & formation',
      description: 'Conseil, audits, études de faisabilité, formation du personnel, AMO',
    },
    {
      label: 'Commercialisation & distribution',
      description: 'Importation et distribution de matériel d\'automatisme, instrumentation et électricité industrielle',
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
