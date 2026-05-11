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

type AdminSection = 'emails' | 'company' | 'home' | 'contact';

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

  readonly activeSection = signal<AdminSection>('emails');
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

  // Login
  loginEmail = '';
  loginPassword = '';

  ngOnInit(): void {
    if (this.isAuthenticated()) {
      this.quoteRequests.fetchRequests();
      this.companyInfo.fetchCompanyInfo();
      this.companyInfo.fetchServices();
      this.companyInfo.fetchCompanyValues();
      this.companyInfo.fetchHomepageContent();
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

  readonly availableIcons = ['engineering', 'handshake', 'workspace_premium', 'precision_manufacturing', 'monitoring', 'support_agent', 'verified', 'security'];
  readonly cardIcons = ['precision_manufacturing', 'monitoring', 'water_drop', 'router', 'engineering', 'handshake', 'workspace_premium', 'support_agent'];
}