import { NgForm } from '@angular/forms';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/auth.service';
import { COMPANY } from '../../../core/company.config';
import { QuoteRequestsService } from '../../../core/quote-requests.service';
import { CompanyInfoService } from '../../../core/company-info.service';
import { ToastService } from '../../../shared/toast/toast.service';
import { QuoteRequestRow } from '../../../core/supabase.service';

type AdminSection = 'emails' | 'company' | 'home' | 'contact' | 'references' | 'services' | 'about' | 'contact_content';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly quoteRequests = inject(QuoteRequestsService);
  private readonly companyInfo = inject(CompanyInfoService);
  private readonly toast = inject(ToastService);

  readonly companyName = COMPANY.name;
  readonly user = this.auth.user;
  readonly isAuthenticated = this.auth.isAuthenticated;
  readonly isLoading = this.quoteRequests.isLoading;
  readonly requests = this.quoteRequests.requests;
  readonly stats = this.quoteRequests.stats;
  readonly companyInfoData = this.companyInfo.companyInfo;
  readonly services = this.companyInfo.services;
  readonly companyValues = this.companyInfo.companyValues;
  readonly homepageImages = this.companyInfo.homepageImages;
  readonly homepageHeroStats = this.companyInfo.homepageHeroStats;
  readonly homepageExpertiseCards = this.companyInfo.homepageExpertiseCards;
  readonly referencesHero = this.companyInfo.referencesHero;
  readonly referencesFeaturedProject = this.companyInfo.referencesFeaturedProject;
  readonly referencesPerformanceStats = this.companyInfo.referencesPerformanceStats;
  readonly referencesSideProjects = this.companyInfo.referencesSideProjects;
  readonly referencesQualityPoints = this.companyInfo.referencesQualityPoints;
  readonly referencesImages = this.companyInfo.referencesImages;
  readonly servicesPageHero = this.companyInfo.servicesPageHero;
  readonly servicesMethodology = this.companyInfo.servicesMethodology;
  readonly methodologySteps = this.companyInfo.methodologySteps;
  readonly servicesImages = this.companyInfo.servicesImages;
  readonly aboutHero = this.companyInfo.aboutHero;
  readonly aboutAvailability = this.companyInfo.aboutAvailability;
  readonly aboutMission = this.companyInfo.aboutMission;
  readonly aboutCompany = this.companyInfo.aboutCompany;
  readonly aboutServicesSection = this.companyInfo.aboutServicesSection;
  readonly aboutValuesSection = this.companyInfo.aboutValuesSection;
  readonly aboutCtaSection = this.companyInfo.aboutCtaSection;
  readonly aboutImages = this.companyInfo.aboutImages;
  readonly contactPageHero = this.companyInfo.contactPageHero;
  readonly contactStats = this.companyInfo.contactStats;
  readonly projectTypes = this.companyInfo.projectTypes;
  readonly contactFormContent = this.companyInfo.contactFormContent;
  readonly formLabels = this.companyInfo.formLabels;
  readonly searchQuery = signal('');

  readonly filteredRequests = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return this.requests();
    return this.requests().filter(
      (r) =>
        r.full_name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.project_type.toLowerCase().includes(q),
    );
  });

  readonly selectedRequest = signal<QuoteRequestRow | null>(null);

  // CMS edit states
  readonly editingServiceId = signal<string | null>(null);
  readonly editingValueId = signal<string | null>(null);
  readonly showAddService = signal(false);
  serviceForm = { label: '', description: '' };
  valueForm = { icon: '', title: '', description: '' };
  readonly editingImageKey = signal<string | null>(null);
  heroStatsForm = {
    stat1_label: 'Années d\'expérience terrain', stat1_value: '5+', stat1_sub: 'En industrie', stat1_accent_class: 'bg-tertiary',
    stat2_label: 'Taux de satisfaction client', stat2_value: '100%', stat2_sub: 'Clients accompagnés', stat2_accent_class: 'bg-tertiary-container',
  };
  cardForm = { icon: '', title: '', description: '', tags: '' };
  imageForm = { key: '', url: '', alt_text: '' };
  readonly showAddCard = signal(false);
  readonly editingCardId = signal<string | null>(null);
  readonly editingRefImageKey = signal<string | null>(null);
  refImageForm = { key: '', url: '', alt_text: '' };
  readonly editingServicesImageKey = signal<string | null>(null);
  servicesImageForm = { key: '', url: '', alt_text: '' };
  readonly editingAboutImageKey = signal<string | null>(null);
  aboutImageForm = { key: '', url: '', alt_text: '' };

  // Contact content forms
  contactHeroForm = { label: '', headline: '', body: '' };
  contactFormContentForm = { form_title: '', success_title: '', success_body: '', error_message: '', footer_note: '', submit_label: '', loading_label: '' };
  formLabelsForm = { full_name_label: '', full_name_error: '', full_name_placeholder: '', phone_label: '', phone_error: '', phone_placeholder: '', email_label: '', email_error: '', email_placeholder: '', desired_date_label: '', desired_date_placeholder: '', project_type_label: '', description_label: '', description_error: '', description_placeholder: '' };

  // References forms
  referencesHeroForm = { label: '', headline: '', body: '' };
  featuredProjectForm = { sector: '', title: '', technology: '', tech_label: '', specs_json: '', image_key: '', image_alt: '', result: '' };
  loginEmail = '';
  loginPassword = '';

  ngOnInit(): void {
    if (this.isAuthenticated()) {
      this.quoteRequests.fetchRequests();
      this.companyInfo.fetchCompanyInfo();
      this.companyInfo.fetchServices();
      this.companyInfo.fetchCompanyValues();
      this.companyInfo.fetchHomepageContent();
      this.companyInfo.fetchReferencesContent();
      this.companyInfo.fetchServicesContent();
      this.companyInfo.fetchAboutContent();
      this.companyInfo.fetchContactContent();
    }
  }

  setSection(section: AdminSection): void { this.activeSection.set(section); }

  // Email handlers
  selectRequest(req: QuoteRequestRow): void { this.selectedRequest.set(req); }
  closeDetail(): void { this.selectedRequest.set(null); }
  async signOut(): Promise<void> { await this.auth.signOut(); this.selectedRequest.set(null); }
  async markAsRead(id: string): Promise<void> {
    const { error } = await this.quoteRequests.markAsRead(id);
    if (error) { this.toast.error(); }
    else { this.selectedRequest.update((r) => r?.id === id ? { ...r, read: true } : r); }
  }
  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }
  async onLogin(): Promise<void> {
    if (!this.loginEmail || !this.loginPassword) return;
    const { error } = await this.auth.signIn(this.loginEmail, this.loginPassword);
    if (error) { this.toast.error('Identifiants incorrects'); }
    else {
      this.quoteRequests.fetchRequests();
      this.companyInfo.fetchCompanyInfo();
      this.companyInfo.fetchServices();
      this.companyInfo.fetchCompanyValues();
      this.companyInfo.fetchHomepageContent();
      this.companyInfo.fetchReferencesContent();
      this.companyInfo.fetchServicesContent();
      this.companyInfo.fetchAboutContent();
      this.companyInfo.fetchContactContent();
    }
  }

  // CMS: Company Info
  async saveCompanyInfo(form: NgForm): Promise<void> {
    const { error } = await this.companyInfo.updateCompanyInfo(form.value);
    if (error) { this.toast.error('Erreur lors de la sauvegarde'); return; }
    this.toast.success('Modifications enregistrées');
  }

  // CMS: Services
  startEditService(id: string): void {
    const s = this.services().find(x => x.id === id);
    if (s) { this.serviceForm = { label: s.label, description: s.description }; this.editingServiceId.set(id); }
  }
  cancelEditService(): void { this.editingServiceId.set(null); this.serviceForm = { label: '', description: '' }; this.showAddService.set(false); }
  async saveService(): Promise<void> {
    const id = this.editingServiceId();
    if (!this.serviceForm.label.trim()) return;
    if (id) {
      const { error } = await this.companyInfo.updateService(id, this.serviceForm.label, this.serviceForm.description);
      if (error) { this.toast.error('Erreur lors de la mise à jour'); return; }
      this.toast.success('Service mis à jour');
    } else {
      const { error } = await this.companyInfo.createService(this.serviceForm.label, this.serviceForm.description);
      if (error) { this.toast.error('Erreur lors de l\'ajout'); return; }
      this.toast.success('Service ajouté');
    }
    this.cancelEditService();
  }
  async deleteService(id: string): Promise<void> {
    if (!confirm('Supprimer ce service ?')) return;
    const { error } = await this.companyInfo.deleteService(id);
    if (error) { this.toast.error('Erreur lors de la suppression'); return; }
    this.toast.success('Service supprimé');
  }
  showAddServiceForm(): void { this.serviceForm = { label: '', description: '' }; this.showAddService.set(true); this.editingServiceId.set(null); }
  async moveService(id: string, direction: 'up' | 'down'): Promise<void> {
    const list = this.services();
    const index = list.findIndex(s => s.id === id);
    if (direction === 'up' && index > 0) {
      const prev = list[index - 1];
      const curr = list[index];
      const { error } = await this.companyInfo.swapServiceOrder(curr.id, prev.id);
      if (error) { this.toast.error('Erreur lors du réordonnancement'); return; }
    } else if (direction === 'down' && index < list.length - 1) {
      const curr = list[index];
      const next = list[index + 1];
      const { error } = await this.companyInfo.swapServiceOrder(curr.id, next.id);
      if (error) { this.toast.error('Erreur lors du réordonnancement'); return; }
    }
  }

  // CMS: Values
  startEditValue(id: string): void {
    const v = this.companyValues().find(x => x.id === id);
    if (v) { this.valueForm = { icon: v.icon, title: v.title, description: v.description }; this.editingValueId.set(id); }
  }
  cancelEditValue(): void { this.editingValueId.set(null); this.valueForm = { icon: '', title: '', description: '' }; }
  async saveValue(): Promise<void> {
    const id = this.editingValueId();
    if (!id || !this.valueForm.title.trim()) return;
    const { error } = await this.companyInfo.updateCompanyValue(id, this.valueForm.icon, this.valueForm.title, this.valueForm.description);
    if (error) { this.toast.error('Erreur lors de la mise à jour'); return; }
    this.toast.success('Engagement mis à jour');
    this.cancelEditValue();
  }

  // CMS: Homepage Hero Stats
  async saveHeroStats(): Promise<void> {
    const { error } = await this.companyInfo.updateHomepageHeroStats(this.heroStatsForm as any);
    if (error) { this.toast.error('Erreur lors de la sauvegarde'); return; }
    this.toast.success('Statistiques mises à jour');
  }

  // CMS: Homepage Expertise Cards
  startEditCard(card: any): void {
    this.cardForm = { icon: card.icon, title: card.title, description: card.description, tags: card.tags.join(', ') };
    this.editingCardId.set(card.id);
    this.showAddCard.set(false);
  }
  cancelEditCard(): void { this.editingCardId.set(null); this.cardForm = { icon: '', title: '', description: '', tags: '' }; this.showAddCard.set(false); }
  async saveCard(): Promise<void> {
    const id = this.editingCardId();
    const tags = this.cardForm.tags.split(',').map((t: string) => t.trim()).filter(Boolean);
    if (!this.cardForm.title.trim()) return;
    if (id) {
      const { error } = await this.companyInfo.updateHomepageExpertiseCard(id, { icon: this.cardForm.icon, title: this.cardForm.title, description: this.cardForm.description, tags });
      if (error) { this.toast.error('Erreur lors de la mise à jour'); return; }
      this.toast.success('Carte mise à jour');
    }
    this.cancelEditCard();
  }
  async deleteCard(id: string): Promise<void> {
    if (!confirm('Supprimer cette carte ?')) return;
    const { error } = await this.companyInfo.deleteHomepageExpertiseCard(id);
    if (error) { this.toast.error('Erreur lors de la suppression'); return; }
    this.toast.success('Carte supprimée');
  }
  showAddCardForm(): void { this.cardForm = { icon: 'precision_manufacturing', title: '', description: '', tags: '' }; this.showAddCard.set(true); this.editingCardId.set(null); }

  // CMS: Homepage Images
  async startEditImage(key: string): Promise<void> {
    const img = this.homepageImages().find(i => i.image_key === key);
    this.imageForm = img ? { key: img.image_key, url: img.url, alt_text: img.alt_text } : { key, url: '', alt_text: '' };
    this.editingImageKey.set(key);
  }
  cancelEditImage(): void { this.editingImageKey.set(null); this.imageForm = { key: '', url: '', alt_text: '' }; }
  async saveImage(): Promise<void> {
    if (!this.imageForm.url.trim()) { this.toast.error('L\'URL est requise'); return; }
    const { error } = await this.companyInfo.upsertHomepageImage(this.imageForm.key, this.imageForm.url, this.imageForm.alt_text);
    if (error) { this.toast.error('Erreur lors de la sauvegarde'); return; }
    this.toast.success('Image mise à jour');
    this.cancelEditImage();
  }

  // CMS: References Hero
  async saveReferencesHero(): Promise<void> {
    const hero = this.referencesHero();
    if (!hero) return;
    const { error } = await this.companyInfo.updateReferencesHero({ ...hero, ...this.referencesHeroForm });
    if (error) { this.toast.error('Erreur lors de la sauvegarde'); return; }
    this.toast.success('Hero mis à jour');
  }

  // CMS: Featured Project
  async saveFeaturedProject(): Promise<void> {
    const fp = this.referencesFeaturedProject();
    if (!fp) return;
    const { error } = await this.companyInfo.updateReferencesFeaturedProject({ ...fp, ...this.featuredProjectForm });
    if (error) { this.toast.error('Erreur lors de la sauvegarde'); return; }
    this.toast.success('Projet mis à jour');
  }

  async savePerfStat(stat: any): Promise<void> {
    const { error } = await this.companyInfo.updateReferencesPerformanceStat({ id: stat.id, value: stat.value, label: stat.label });
    if (error) { this.toast.error('Erreur lors de la sauvegarde'); return; }
    this.toast.success('Statistique mise à jour');
  }

  async saveSideProject(project: any): Promise<void> {
    const { error } = await this.companyInfo.updateReferencesSideProject(project.id, { sector: project.sector, title: project.title, description: project.description, key_spec: project.key_spec });
    if (error) { this.toast.error('Erreur lors de la sauvegarde'); return; }
    this.toast.success('Projet mis à jour');
  }

  async saveQualityPoint(point: any): Promise<void> {
    const { error } = await this.companyInfo.updateReferencesQualityPoint(point.id, { icon: point.icon, title: point.title, description: point.description });
    if (error) { this.toast.error('Erreur lors de la sauvegarde'); return; }
    this.toast.success('Point qualité mis à jour');
  }

  async startEditRefImage(key: string): Promise<void> {
    const img = this.referencesImages().find(i => i.image_key === key);
    this.refImageForm = img ? { key: img.image_key, url: img.url, alt_text: img.alt_text } : { key, url: '', alt_text: '' };
    this.editingRefImageKey.set(key);
  }
  cancelEditRefImage(): void { this.editingRefImageKey.set(null); this.refImageForm = { key: '', url: '', alt_text: '' }; }
  async saveRefImage(): Promise<void> {
    if (!this.refImageForm.url.trim()) { this.toast.error('L\'URL est requise'); return; }
    const { error } = await this.companyInfo.upsertReferencesImage(this.refImageForm.key, this.refImageForm.url, this.refImageForm.alt_text);
    if (error) { this.toast.error('Erreur lors de la sauvegarde'); return; }
    this.toast.success('Image mise à jour');
    this.cancelEditRefImage();
  }

  // CMS: About Hero
  aboutHeroForm = { label: '', headline: '', body: '' };
  async saveAboutHero(): Promise<void> {
    const h = this.aboutHero();
    if (!h) return;
    const { error } = await this.companyInfo.updateAboutHero({ ...h, ...this.aboutHeroForm });
    if (error) { this.toast.error('Erreur lors de la sauvegarde'); return; }
    this.toast.success('Hero mis à jour');
  }

  // CMS: About Availability
  aboutAvailForm = { label: '', days: '', hours: '' };
  async saveAboutAvailability(): Promise<void> {
    const a = this.aboutAvailability();
    if (!a) return;
    const { error } = await this.companyInfo.updateAboutAvailability({ ...a, ...this.aboutAvailForm });
    if (error) { this.toast.error('Erreur lors de la sauvegarde'); return; }
    this.toast.success('Disponibilité mise à jour');
  }

  // CMS: About Mission
  aboutMissionForm = { label: '', quote: '' };
  async saveAboutMission(): Promise<void> {
    const m = this.aboutMission();
    if (!m) return;
    const { error } = await this.companyInfo.updateAboutMission({ ...m, ...this.aboutMissionForm });
    if (error) { this.toast.error('Erreur lors de la sauvegarde'); return; }
    this.toast.success('Mission mise à jour');
  }

  // CMS: About Company
  aboutCompanyForm = { label: '', body: '' };
  async saveAboutCompany(): Promise<void> {
    const c = this.aboutCompany();
    if (!c) return;
    const { error } = await this.companyInfo.updateAboutCompany({ ...c, ...this.aboutCompanyForm });
    if (error) { this.toast.error('Erreur lors de la sauvegarde'); return; }
    this.toast.success('Description mise à jour');
  }

  // CMS: About Services Section
  aboutServicesSectionForm = { headline: '', subtext: '' };
  async saveAboutServicesSection(): Promise<void> {
    const s = this.aboutServicesSection();
    if (!s) return;
    const { error } = await this.companyInfo.updateAboutServicesSection({ ...s, ...this.aboutServicesSectionForm });
    if (error) { this.toast.error('Erreur lors de la sauvegarde'); return; }
    this.toast.success('Section services mise à jour');
  }

  // CMS: About Values Section
  aboutValuesSectionForm = { headline: '', subtext: '' };
  async saveAboutValuesSection(): Promise<void> {
    const v = this.aboutValuesSection();
    if (!v) return;
    const { error } = await this.companyInfo.updateAboutValuesSection({ ...v, ...this.aboutValuesSectionForm });
    if (error) { this.toast.error('Erreur lors de la sauvegarde'); return; }
    this.toast.success('Section engagements mise à jour');
  }

  // CMS: About CTA Section
  aboutCtaSectionForm = { headline: '', subtext: '', cta_primary_label: '', cta_primary_link: '', cta_secondary_label: '', cta_secondary_link: '' };
  async saveAboutCtaSection(): Promise<void> {
    const c = this.aboutCtaSection();
    if (!c) return;
    const { error } = await this.companyInfo.updateAboutCtaSection({ ...c, ...this.aboutCtaSectionForm });
    if (error) { this.toast.error('Erreur lors de la sauvegarde'); return; }
    this.toast.success('Section CTA mise à jour');
  }

  async startEditAboutImage(key: string): Promise<void> {
    const img = this.aboutImages().find(i => i.image_key === key);
    this.aboutImageForm = img ? { key: img.image_key, url: img.url, alt_text: img.alt_text } : { key, url: '', alt_text: '' };
    this.editingAboutImageKey.set(key);
  }
  cancelEditAboutImage(): void { this.editingAboutImageKey.set(null); this.aboutImageForm = { key: '', url: '', alt_text: '' }; }
  async saveAboutImage(): Promise<void> {
    if (!this.aboutImageForm.url.trim()) { this.toast.error('L\'URL est requise'); return; }
    const { error } = await this.companyInfo.upsertAboutImage(this.aboutImageForm.key, this.aboutImageForm.url, this.aboutImageForm.alt_text);
    if (error) { this.toast.error('Erreur lors de la sauvegarde'); return; }
    this.toast.success('Image mise à jour');
    this.cancelEditAboutImage();
  }

  // CMS: Contact Hero
  async saveContactHero(): Promise<void> {
    const h = this.contactPageHero();
    if (!h) return;
    const { error } = await this.companyInfo.updateContactPageHero({ ...h, ...this.contactHeroForm });
    if (error) { this.toast.error('Erreur lors de la sauvegarde'); return; }
    this.toast.success('Hero mis à jour');
  }

  // CMS: Contact Stats
  async saveContactStat(stat: any): Promise<void> {
    const { error } = await this.companyInfo.updateContactStat({ id: stat.id, value: stat.value, label: stat.label });
    if (error) { this.toast.error('Erreur lors de la sauvegarde'); return; }
    this.toast.success('Stat mise à jour');
  }

  // CMS: Project Types
  async saveProjectType(pt: any): Promise<void> {
    const { error } = await this.companyInfo.updateProjectType(pt.id, pt.label);
    if (error) { this.toast.error('Erreur lors de la sauvegarde'); return; }
    this.toast.success('Type mis à jour');
  }

  // CMS: Contact Form Content
  async saveContactFormContent(): Promise<void> {
    const c = this.contactFormContent();
    if (!c) return;
    const { error } = await this.companyInfo.updateContactFormContent({ ...c, ...this.contactFormContentForm });
    if (error) { this.toast.error('Erreur lors de la sauvegarde'); return; }
    this.toast.success('Formulaire mis à jour');
  }

  // CMS: Form Labels
  async saveFormLabels(): Promise<void> {
    const f = this.formLabels();
    if (!f) return;
    const { error } = await this.companyInfo.updateFormLabels({ ...f, ...this.formLabelsForm });
    if (error) { this.toast.error('Erreur lors de la sauvegarde'); return; }
    this.toast.success('Labels mis à jour');
  }

  readonly availableIcons = ['engineering', 'handshake', 'workspace_premium', 'precision_manufacturing', 'monitoring', 'support_agent', 'verified', 'security'];
  readonly cardIcons = ['precision_manufacturing', 'monitoring', 'water_drop', 'router', 'engineering', 'handshake', 'workspace_premium', 'support_agent'];
}