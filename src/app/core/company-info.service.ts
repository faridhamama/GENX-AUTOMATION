import { computed, inject, Injectable, signal } from '@angular/core';
import { SupabaseService } from './services/supabase.service';
import { CompanyFacade } from './company.facade';
import { HomeFacade } from './home.facade';
import { ReferencesFacade } from './references.facade';
import { ServicesPageFacade } from './services-page.facade';
import { AboutFacade } from './about.facade';
import { ContactFacade } from './contact.facade';

// Re-export for consumers
export type { CompanyInfo, Service, CompanyValue } from './models/company.models';
export type { HomepageHeroStats, HomepageExpertiseCard, HomepageImage } from './models/homepage.models';

@Injectable({ providedIn: 'root' })
export class CompanyInfoService {
  private readonly supabase = inject(SupabaseService);
  private readonly companyFacade = inject(CompanyFacade);
  private readonly homeFacade = inject(HomeFacade);
  private readonly referencesFacade = inject(ReferencesFacade);
  private readonly servicesFacade = inject(ServicesPageFacade);
  private readonly aboutFacade = inject(AboutFacade);
  private readonly contactFacade = inject(ContactFacade);

  // Company info
  readonly companyInfo = this.companyFacade.companyInfo;
  readonly isLoading = this.companyFacade.isLoading;

  // Services
  readonly services = this.companyFacade.services;
  readonly servicesLoading = this.companyFacade.servicesLoading;

  // Company values
  readonly companyValues = this.companyFacade.companyValues;
  readonly valuesLoading = this.companyFacade.valuesLoading;

  // Homepage
  readonly homepageHeroStats = this.homeFacade.homepageHeroStats;
  readonly homepageExpertiseCards = this.homeFacade.homepageExpertiseCards;
  readonly homepageImages = this.homeFacade.homepageImages;
  readonly homepageLoading = this.homeFacade.homepageLoading;

  // References
  readonly referencesHero = this.referencesFacade.referencesHero;
  readonly referencesFeaturedProject = this.referencesFacade.referencesFeaturedProject;
  readonly referencesPerformanceStats = this.referencesFacade.referencesPerformanceStats;
  readonly referencesSideProjects = this.referencesFacade.referencesSideProjects;
  readonly referencesQualityPoints = this.referencesFacade.referencesQualityPoints;
  readonly referencesImages = this.referencesFacade.referencesImages;
  readonly referencesLoading = this.referencesFacade.referencesLoading;
  readonly referencesImagesMap = this.referencesFacade.referencesImagesMap;

  // Services page
  readonly servicesPageHero = this.servicesFacade.servicesPageHero;
  readonly servicesMethodology = this.servicesFacade.servicesMethodology;
  readonly methodologySteps = this.servicesFacade.methodologySteps;
  readonly servicesImages = this.servicesFacade.servicesImages;
  readonly servicesImagesMap = this.servicesFacade.servicesImagesMap;

  // About
  readonly aboutHero = this.aboutFacade.aboutHero;
  readonly aboutAvailability = this.aboutFacade.aboutAvailability;
  readonly aboutMission = this.aboutFacade.aboutMission;
  readonly aboutCompany = this.aboutFacade.aboutCompany;
  readonly aboutServicesSection = this.aboutFacade.aboutServicesSection;
  readonly aboutValuesSection = this.aboutFacade.aboutValuesSection;
  readonly aboutCtaSection = this.aboutFacade.aboutCtaSection;
  readonly aboutImages = this.aboutFacade.aboutImages;
  readonly aboutImagesMap = this.aboutFacade.aboutImagesMap;

  // Contact
  readonly contactPageHero = this.contactFacade.contactPageHero;
  readonly contactStats = this.contactFacade.contactStats;
  readonly projectTypes = this.contactFacade.projectTypes;
  readonly contactFormContent = this.contactFacade.contactFormContent;
  readonly formLabels = this.contactFacade.formLabels;

  // Homepage hero content
  readonly homepageHeroContent = this.homeFacade.homepageHeroContent;

  // --- Company Info ---
  async fetchCompanyInfo(): Promise<void> {
    await this.companyFacade.fetchCompanyInfo();
  }

  async updateCompanyInfo(info: Partial<import('./models/company.models').CompanyInfo>): Promise<{ error: string | null }> {
    return this.companyFacade.updateCompanyInfo(info);
  }

  // --- Services ---
  async fetchServices(): Promise<void> {
    await this.companyFacade.fetchServices();
  }

  async createService(label: string, description: string): Promise<{ error: string | null }> {
    return this.companyFacade.createService(label, description);
  }

  async updateService(id: string, label: string, description: string): Promise<{ error: string | null }> {
    return this.companyFacade.updateService(id, label, description);
  }

  async deleteService(id: string): Promise<{ error: string | null }> {
    return this.companyFacade.deleteService(id);
  }

  async reorderServices(orderedIds: string[]): Promise<{ error: string | null }> {
    for (let i = 0; i < orderedIds.length; i++) {
      const { error } = await this.companyFacade.updateService(orderedIds[i], '', '');
      if (error) return { error };
    }
    await this.fetchServices();
    return { error: null };
  }

  async swapServiceOrder(id1: string, id2: string): Promise<{ error: string | null }> {
    return this.companyFacade.swapServiceOrder(id1, id2);
  }

  // --- Company Values ---
  async fetchCompanyValues(): Promise<void> {
    await this.companyFacade.fetchCompanyValues();
  }

  async updateCompanyValue(id: string, icon: string, title: string, description: string): Promise<{ error: string | null }> {
    return this.companyFacade.updateCompanyValue(id, icon, title, description);
  }

  // --- Homepage ---
  async fetchHomepageContent(): Promise<void> {
    await this.homeFacade.fetchHomepageContent();
  }

  async updateHomepageHeroStats(stats: import('./models/homepage.models').HomepageHeroStats): Promise<{ error: string | null }> {
    return this.homeFacade.updateHomepageHeroStats(stats);
  }

  async updateHomepageExpertiseCard(id: string, card: Partial<import('./models/homepage.models').HomepageExpertiseCard>): Promise<{ error: string | null }> {
    return this.homeFacade.updateHomepageExpertiseCard(id, card);
  }

  async deleteHomepageExpertiseCard(id: string): Promise<{ error: string | null }> {
    return this.homeFacade.deleteHomepageExpertiseCard(id);
  }

  async upsertHomepageImage(key: string, url: string, alt: string): Promise<{ error: string | null }> {
    return this.homeFacade.upsertHomepageImage(key, url, alt);
  }

  async updateHomepageHeroContent(content: import('./models/homepage.models').HomepageHeroContentRow): Promise<{ error: string | null }> {
    return this.homeFacade.updateHomepageHeroContent(content);
  }

  async fetchHomepageHeroContent(): Promise<void> {
    await this.homeFacade.fetchHomepageHeroContent();
  }

  // --- References ---
  async fetchReferencesContent(): Promise<void> {
    await this.referencesFacade.fetchReferencesContent();
  }

  async updateReferencesHero(hero: import('./models/index').ReferencesHeroRow): Promise<{ error: string | null }> {
    return this.referencesFacade.updateReferencesHero(hero);
  }

  async updateReferencesFeaturedProject(project: import('./models/index').ReferencesFeaturedProjectRow): Promise<{ error: string | null }> {
    return this.referencesFacade.updateReferencesFeaturedProject(project);
  }

  async updateReferencesPerformanceStat(stat: Partial<import('./models/index').ReferencesPerformanceStatRow> & { id: string }): Promise<{ error: string | null }> {
    return this.referencesFacade.updateReferencesPerformanceStat(stat);
  }

  async updateReferencesSideProject(id: string, project: Partial<import('./models/index').ReferencesSideProjectRow>): Promise<{ error: string | null }> {
    return this.referencesFacade.updateReferencesSideProject(id, project);
  }

  async deleteReferencesSideProject(id: string): Promise<{ error: string | null }> {
    return this.referencesFacade.deleteReferencesSideProject(id);
  }

  async updateReferencesQualityPoint(id: string, point: Partial<import('./models/index').ReferencesQualityPointRow>): Promise<{ error: string | null }> {
    return this.referencesFacade.updateReferencesQualityPoint(id, point);
  }

  async upsertReferencesImage(key: string, url: string, alt: string): Promise<{ error: string | null }> {
    return this.referencesFacade.upsertReferencesImage(key, url, alt);
  }

  // --- Services ---
  async fetchServicesContent(): Promise<void> {
    await this.servicesFacade.fetchServicesContent();
  }

  async updateServicesPageHero(hero: import('./models/index').ServicesPageHeroRow): Promise<{ error: string | null }> {
    return this.servicesFacade.updateServicesPageHero(hero);
  }

  async updateServicesMethodology(methodology: import('./models/index').ServicesMethodologyRow): Promise<{ error: string | null }> {
    return this.servicesFacade.updateServicesMethodology(methodology);
  }

  async updateMethodologyStep(id: string, step: Partial<import('./models/index').MethodologyStepRow>): Promise<{ error: string | null }> {
    return this.servicesFacade.updateMethodologyStep(id, step);
  }

  async upsertServicesImage(key: string, url: string, alt: string): Promise<{ error: string | null }> {
    return this.servicesFacade.upsertServicesImage(key, url, alt);
  }

  // --- About ---
  async fetchAboutContent(): Promise<void> {
    await this.aboutFacade.fetchAboutContent();
  }

  async updateAboutHero(hero: import('./models/index').AboutHeroRow): Promise<{ error: string | null }> {
    return this.aboutFacade.updateAboutHero(hero);
  }

  async updateAboutAvailability(avail: import('./models/index').AboutAvailabilityRow): Promise<{ error: string | null }> {
    return this.aboutFacade.updateAboutAvailability(avail);
  }

  async updateAboutMission(mission: import('./models/index').AboutMissionRow): Promise<{ error: string | null }> {
    return this.aboutFacade.updateAboutMission(mission);
  }

  async updateAboutCompany(company: import('./models/index').AboutCompanyRow): Promise<{ error: string | null }> {
    return this.aboutFacade.updateAboutCompany(company);
  }

  async updateAboutServicesSection(section: import('./models/index').AboutServicesSectionRow): Promise<{ error: string | null }> {
    return this.aboutFacade.updateAboutServicesSection(section);
  }

  async updateAboutValuesSection(section: import('./models/index').AboutValuesSectionRow): Promise<{ error: string | null }> {
    return this.aboutFacade.updateAboutValuesSection(section);
  }

  async updateAboutCtaSection(cta: import('./models/index').AboutCtaSectionRow): Promise<{ error: string | null }> {
    return this.aboutFacade.updateAboutCtaSection(cta);
  }

  async upsertAboutImage(key: string, url: string, alt: string): Promise<{ error: string | null }> {
    return this.aboutFacade.upsertAboutImage(key, url, alt);
  }

  // --- Contact ---
  async fetchContactContent(): Promise<void> {
    await this.contactFacade.fetchContactContent();
  }

  async updateContactPageHero(hero: import('./models/index').ContactPageHeroRow): Promise<{ error: string | null }> {
    return this.contactFacade.updateContactPageHero(hero);
  }

  async updateContactStat(stat: Partial<import('./models/index').ContactStatRow> & { id: string }): Promise<{ error: string | null }> {
    return this.contactFacade.updateContactStat(stat.id, stat);
  }

  async updateProjectType(id: string, label: string): Promise<{ error: string | null }> {
    return this.contactFacade.updateProjectType(id, label);
  }

  async updateContactFormContent(content: import('./models/index').ContactFormContentRow): Promise<{ error: string | null }> {
    return this.contactFacade.updateContactFormContent(content);
  }

  async updateFormLabels(labels: import('./models/index').FormLabelsRow): Promise<{ error: string | null }> {
    return this.contactFacade.updateFormLabels(labels);
  }

  // Auth (still using SupabaseService directly)
  async signIn(email: string, password: string): Promise<{ error: string | null }> {
    return this.supabase.signIn(email, password);
  }

  async signOut(): Promise<void> {
    return this.supabase.signOut();
  }

  onAuthStateChange(callback: (event: string, session: unknown) => void): () => void {
    return this.supabase.onAuthStateChange(callback);
  }

  async insertQuoteRequest(data: import('./models/index').QuoteRequest): Promise<{ error: string | null }> {
    return this.supabase.insertQuoteRequest(data);
  }

  async fetchQuoteRequests(): Promise<{ data: import('./models/index').QuoteRequestRow[]; error: string | null }> {
    return this.supabase.fetchQuoteRequests();
  }

  async markAsRead(id: string): Promise<{ error: string | null }> {
    return this.supabase.markAsRead(id);
  }
}