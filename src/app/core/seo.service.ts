import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { Meta } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { COMPANY } from './company.config';

export interface PageSeo {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  noIndex?: boolean;
}

const DEFAULT_SEO: PageSeo = {
  title: COMPANY.name,
  description: COMPANY.tagline,
  keywords: 'automatisation industrielle, robotique, SCADA, GENX AUTOMATION, Maroc, Casablanca',
  ogImage: '/assets/og-image.svg',
};

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly router = inject(Router);
  private readonly doc = inject(DOCUMENT);

  private readonly siteName = COMPANY.name;

  private get baseUrl(): string {
    return this.doc.location.origin;
  }

  init(): void {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => {
        const seo = this.getSeoFromRoute();
        this.apply(seo);
      });

    // Apply on first load
    this.apply(DEFAULT_SEO);
  }

  private getSeoFromRoute(): PageSeo {
    const url = this.router.url.split('?')[0].replace('/', '') || 'home';
    return (SEO_DATA as Record<string, PageSeo>)[url] ?? DEFAULT_SEO;
  }

  private apply(seo: PageSeo): void {
    const fullTitle = `${seo.title} — ${this.siteName}`;
    const pageUrl = `${this.baseUrl}${this.router.url}`;
    const ogImage = seo.ogImage?.startsWith('http')
      ? seo.ogImage
      : `${this.baseUrl}${seo.ogImage}`;

    const robots = seo.noIndex ? 'noindex, nofollow' : 'index, follow';

    this.title.setTitle(fullTitle);

    this.meta.updateTag({ name: 'robots', content: robots });
    this.meta.updateTag({ name: 'description', content: seo.description });
    this.meta.updateTag({ name: 'keywords', content: seo.keywords ?? DEFAULT_SEO.keywords ?? '' });
    this.meta.updateTag({ name: 'author', content: this.siteName });
    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ property: 'og:description', content: seo.description });
    this.meta.updateTag({ property: 'og:site_name', content: this.siteName });
    this.meta.updateTag({ property: 'og:url', content: pageUrl });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:locale', content: 'fr_FR' });
    this.meta.updateTag({ property: 'og:image', content: ogImage });
    this.meta.updateTag({ property: 'og:image:width', content: '1200' });
    this.meta.updateTag({ property: 'og:image:height', content: '630' });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: fullTitle });
    this.meta.updateTag({ name: 'twitter:description', content: seo.description });
    this.meta.updateTag({ name: 'twitter:site', content: '@genxautomation' });
    this.meta.updateTag({ name: 'twitter:image', content: ogImage });

    // Update canonical link
    let canonical = this.doc.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = this.doc.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(canonical);
    }
    canonical.setAttribute('href', pageUrl);
  }
}

const SEO_DATA: Record<string, PageSeo> = {
  home: {
    title: 'Automatisation Industrielle & Robotique',
    description:
      "GENX AUTOMATION conçoit des solutions d'automatisation sur mesure, robotique collaborative et systèmes SCADA pour l'industrie marocaine et internationale.",
    keywords:
      'automatisation industrielle, robotique, cobotique, SCADA, HMI, IoT, Industrie 4.0, Maroc, Casablanca',
    ogImage: '/assets/og-image.svg',
  },
  about: {
    title: 'À Propos — Notre Expertise',
    description:
      "Découvrez l'équipe GENX AUTOMATION : ingénieurs spécialisés en automatisme industriel, robotique et systèmes de supervision. Basés à Casablanca, opérationnel partout.",
    keywords:
      'à propos GENX AUTOMATION, équipe automatisation, ingénieurs robotique, Casablanca, Maroc',
    ogImage: '/assets/og-image.svg',
  },
  services: {
    title: 'Services — Automatisme & Robotique',
    description:
      'Automatisme industriel, robotique & cobotique, vision artificielle, supervision SCADA, maintenance & audit. Des solutions complètes pour votre compétitivité.',
    keywords:
      'services automatisation, robotique industrielle, cobotique, vision artificielle, SCADA, maintenance industrielle, Maroc',
    ogImage: '/assets/og-image.svg',
  },
  references: {
    title: 'Références & Projets Réalisés',
    description:
      "Découvrez nos projets d'automatisation et robotique déployés dans l'industrie marocaine : agro-alimentaire, pharmaceutique, automobile et plus encore.",
    keywords:
      'références automatisation, projets robotique, études de cas, GENX AUTOMATION Maroc',
    ogImage: '/assets/og-image.svg',
  },
  contact: {
    title: 'Contact — Demander un Devis',
    description:
      'Contactez GENX AUTOMATION pour votre projet de automatisation ou robotique. Nos ingénieurs répondent sous 48h. Casablanca, Maroc.',
    keywords:
      'contact GENX AUTOMATION, demande devis automatisation, engineer Morocco',
    ogImage: '/assets/og-image.svg',
  },
};
