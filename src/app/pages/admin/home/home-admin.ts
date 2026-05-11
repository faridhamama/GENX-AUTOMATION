import { ChangeDetectionStrategy, Component, effect, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CompanyInfoService, HomepageExpertiseCard } from '../../../core/company-info.service';
import { ToastService } from '../../../shared/toast/toast.service';

@Component({
  selector: 'app-admin-home',
  imports: [FormsModule],
  templateUrl: './home-admin.html',
  styleUrl: './home-admin.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminHome implements OnInit {
  private readonly companyInfoService = inject(CompanyInfoService);
  private readonly toast = inject(ToastService);

  readonly activeTab = signal<'stats' | 'expertise' | 'images'>('stats');

  readonly heroStats = this.companyInfoService.homepageHeroStats;
  readonly expertiseCards = this.companyInfoService.homepageExpertiseCards;
  readonly homepageImages = this.companyInfoService.homepageImages;

  // Hero stats form - initialized with defaults, updated via effect when data loads
  heroStatsForm = {
    stat1_label: 'Années d\'expérience terrain',
    stat1_value: '5+',
    stat1_sub: 'En industrie',
    stat1_accent_class: 'bg-tertiary',
    stat2_label: 'Taux de satisfaction client',
    stat2_value: '100%',
    stat2_sub: 'Clients accompagnés',
    stat2_accent_class: 'bg-tertiary-container',
  };

  constructor() {
    effect(() => {
      const stats = this.heroStats();
      if (stats) {
        this.heroStatsForm = {
          stat1_label: stats.stat1_label,
          stat1_value: stats.stat1_value,
          stat1_sub: stats.stat1_sub,
          stat1_accent_class: stats.stat1_accent_class,
          stat2_label: stats.stat2_label,
          stat2_value: stats.stat2_value,
          stat2_sub: stats.stat2_sub,
          stat2_accent_class: stats.stat2_accent_class,
        };
      }
    }, { allowSignalWrites: true });
  }

  // Expertise card edit
  editingCardId = signal<string | null>(null);
  cardForm = { icon: '', title: '', description: '', tags: '' };
  showAddCard = signal(false);

  // Image edit
  imageForm = { key: '', url: '', alt_text: '' };
  editingImageKey = signal<string | null>(null);

  ngOnInit(): void {
    this.companyInfoService.fetchHomepageContent();
  }

  setTab(tab: 'stats' | 'expertise' | 'images'): void {
    this.activeTab.set(tab);
  }

  async saveHeroStats(): Promise<void> {
    const { error } = await this.companyInfoService.updateHomepageHeroStats(this.heroStatsForm as any);
    if (error) { this.toast.error('Erreur lors de la sauvegarde'); return; }
    this.toast.success('Statistiques mises à jour');
  }

  startEditCard(card: HomepageExpertiseCard): void {
    this.cardForm = { icon: card.icon, title: card.title, description: card.description, tags: card.tags.join(', ') };
    this.editingCardId.set(card.id);
    this.showAddCard.set(false);
  }

  cancelEditCard(): void {
    this.editingCardId.set(null);
    this.cardForm = { icon: '', title: '', description: '', tags: '' };
    this.showAddCard.set(false);
  }

  async saveCard(): Promise<void> {
    const id = this.editingCardId();
    const tags = this.cardForm.tags.split(',').map((t: string) => t.trim()).filter(Boolean);
    if (!this.cardForm.title.trim()) return;

    if (id) {
      const { error } = await this.companyInfoService.updateHomepageExpertiseCard(id, {
        icon: this.cardForm.icon,
        title: this.cardForm.title,
        description: this.cardForm.description,
        tags,
      });
      if (error) { this.toast.error('Erreur lors de la mise à jour'); return; }
      this.toast.success('Carte mise à jour');
    }
    this.cancelEditCard();
  }

  async deleteCard(id: string): Promise<void> {
    if (!confirm('Supprimer cette carte ?')) return;
    const { error } = await this.companyInfoService.deleteHomepageExpertiseCard(id);
    if (error) { this.toast.error('Erreur lors de la suppression'); return; }
    this.toast.success('Carte supprimée');
  }

  showAddCardForm(): void {
    this.cardForm = { icon: 'precision_manufacturing', title: '', description: '', tags: '' };
    this.showAddCard.set(true);
    this.editingCardId.set(null);
  }

  startEditImage(key: string): void {
    const img = this.homepageImages().find(i => i.image_key === key);
    if (img) {
      this.imageForm = { key: img.image_key, url: img.url, alt_text: img.alt_text };
    } else {
      this.imageForm = { key, url: '', alt_text: '' };
    }
    this.editingImageKey.set(key);
  }

  cancelEditImage(): void {
    this.editingImageKey.set(null);
    this.imageForm = { key: '', url: '', alt_text: '' };
  }

  async saveImage(): Promise<void> {
    if (!this.imageForm.url.trim()) { this.toast.error('L\'URL est requise'); return; }
    const { error } = await this.companyInfoService.upsertHomepageImage(this.imageForm.key, this.imageForm.url, this.imageForm.alt_text);
    if (error) { this.toast.error('Erreur lors de la sauvegarde'); return; }
    this.toast.success('Image mise à jour');
    this.cancelEditImage();
  }

  readonly availableIcons = [
    'precision_manufacturing', 'monitoring', 'water_drop', 'router',
    'engineering', 'handshake', 'workspace_premium', 'support_agent',
  ];
}