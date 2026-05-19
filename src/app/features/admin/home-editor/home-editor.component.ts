import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { FormsModule } from '@angular/forms';
import { CompanyFacade } from '../../../core/company.facade';
import { HomeFacade } from '../../../core/home.facade';
import { SupabaseService } from '../../../core/supabase.service';
import { ToastService } from '../../../shared/toast/toast.service';
import { SectionCardComponent } from '../../../shared/section-card/section-card.component';
import { FormFieldComponent } from '../../../shared/form-field/form-field.component';
import { IconSelectComponent } from '../../../shared/icon-select/icon-select.component';
import { EmptyStateComponent } from '../../../shared/empty-state/empty-state.component';
import { SaveCancelGroupComponent } from '../../../shared/save-cancel-group/save-cancel-group.component';

@Component({
  selector: 'app-home-editor',
  imports: [
    FormField,
    FormsModule,
    SectionCardComponent,
    FormFieldComponent,
    IconSelectComponent,
    EmptyStateComponent,
    SaveCancelGroupComponent,
  ],
  templateUrl: './home-editor.component.html',
  styleUrl: './home-editor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeEditorComponent implements OnInit {
  readonly company = inject(CompanyFacade);
  readonly home = inject(HomeFacade);
  readonly supabase = inject(SupabaseService);
  readonly toast = inject(ToastService);

  // Signals
  readonly editingCardId = signal<string | null>(null);
  readonly showAddCard = signal(false);
  readonly editingImageKey = signal<string | null>(null);
  readonly selectedImageFile = signal<File | null>(null);
  readonly selectedImageKey = signal<string | null>(null);

  // Loading states
  readonly savingHeroContent = signal(false);
  readonly savingHeroStats = signal(false);
  readonly savingCard = signal(false);
  readonly uploadingImage = signal(false);

  private readonly MAX_SIZE = 5 * 1024 * 1024; // 5MB

  // Hero Content Form - Signal Form
  private heroContentModel = signal({
    hero_badge: '',
    hero_headline: '',
    hero_body: '',
    cta_primary_label: '',
    cta_secondary_label: '',
    stats_image_caption: '',
    expertise_label: '',
    expertise_headline: '',
    expertise_subtext: '',
    cta_section_headline: '',
    cta_section_body: '',
    cta_section_label: '',
  });
  readonly heroContentForm = form(this.heroContentModel);

  // Hero Stats Form - Signal Form
  private heroStatsModel = signal({
    stat1_label: '',
    stat1_value: '',
    stat1_sub: '',
    stat2_label: '',
    stat2_value: '',
    stat2_sub: '',
  });
  readonly heroStatsForm = form(this.heroStatsModel);

  // Expertise card form - kept as NgModel for select
  cardForm: {
    icon: string;
    title: string;
    description: string;
    tags: string;
  } = {
    icon: 'precision_manufacturing',
    title: '',
    description: '',
    tags: '',
  };

  // Homepage image form
  imageForm: {
    key: string;
    url: string;
    alt_text: string;
  } = {
    key: '',
    url: '',
    alt_text: '',
  };

  readonly cardIcons = [
    'precision_manufacturing',
    'monitoring',
    'water_drop',
    'router',
    'engineering',
    'handshake',
    'workspace_premium',
    'support_agent',
  ];

  async ngOnInit(): Promise<void> {
    await Promise.all([
      this.home.fetchHomepageContent(),
      this.home.fetchHomepageHeroContent(),
    ]);
    this.syncHeroStatsForm();
    this.syncHeroContentForm();
  }

  private syncHeroContentForm(): void {
    const content = this.home.homepageHeroContent();
    if (content) {
      this.heroContentModel.set({
        hero_badge: content.hero_badge ?? '',
        hero_headline: content.hero_headline ?? '',
        hero_body: content.hero_body ?? '',
        cta_primary_label: content.cta_primary_label ?? '',
        cta_secondary_label: content.cta_secondary_label ?? '',
        stats_image_caption: content.stats_image_caption ?? '',
        expertise_label: content.expertise_label ?? '',
        expertise_headline: content.expertise_headline ?? '',
        expertise_subtext: content.expertise_subtext ?? '',
        cta_section_headline: content.cta_section_headline ?? '',
        cta_section_body: content.cta_section_body ?? '',
        cta_section_label: content.cta_section_label ?? '',
      });
    }
  }

  async saveHeroContent(): Promise<void> {
    const content = this.home.homepageHeroContent();
    if (!content) return;
    this.savingHeroContent.set(true);
    try {
      const { error } = await this.home.updateHomepageHeroContent({
        ...content,
        ...this.heroContentModel(),
      });
      if (error) {
        this.toast.error();
      } else {
        this.toast.success('Contenu hero sauvegarde');
      }
    } finally {
      this.savingHeroContent.set(false);
    }
  }

  private syncHeroStatsForm(): void {
    const stats = this.home.homepageHeroStats();
    if (stats) {
      this.heroStatsModel.set({
        stat1_label: stats.stat1_label ?? '',
        stat1_value: stats.stat1_value ?? '',
        stat1_sub: stats.stat1_sub ?? '',
        stat2_label: stats.stat2_label ?? '',
        stat2_value: stats.stat2_value ?? '',
        stat2_sub: stats.stat2_sub ?? '',
      });
    }
  }

  async saveHeroStats(): Promise<void> {
    const stats = this.home.homepageHeroStats();
    if (!stats) return;
    this.savingHeroStats.set(true);
    try {
      const { error } = await this.home.updateHomepageHeroStats({
        ...stats,
        ...this.heroStatsModel(),
      });
      if (error) {
        this.toast.error();
      } else {
        this.toast.success('Statistiques sauvegardees');
      }
    } finally {
      this.savingHeroStats.set(false);
    }
  }

  startEditCard(card: { id: string; icon: string; title: string; description: string; tags: string[] }): void {
    this.editingCardId.set(card.id);
    this.cardForm = {
      icon: card.icon,
      title: card.title,
      description: card.description,
      tags: card.tags.join(', '),
    };
  }

  cancelEditCard(): void {
    this.editingCardId.set(null);
    this.showAddCard.set(false);
    this.resetCardForm();
  }

  showAddCardForm(): void {
    this.showAddCard.set(true);
    this.resetCardForm();
  }

  private resetCardForm(): void {
    this.cardForm = {
      icon: 'precision_manufacturing',
      title: '',
      description: '',
      tags: '',
    };
  }

  async saveCard(): Promise<void> {
    const tags = this.cardForm.tags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const editingId = this.editingCardId();
    if (editingId) {
      this.savingCard.set(true);
      try {
        const { error } = await this.home.updateHomepageExpertiseCard(editingId, {
          icon: this.cardForm.icon,
          title: this.cardForm.title,
          description: this.cardForm.description,
          tags,
        });
        if (error) {
          this.toast.error();
          return;
        }
        this.toast.success('Carte mise a jour');
        this.cancelEditCard();
      } finally {
        this.savingCard.set(false);
      }
    } else {
      this.toast.error('Creation de carte non implantee');
    }
  }

  async deleteCard(id: string): Promise<void> {
    if (!confirm('Supprimer cette carte d\'expertise ? Cette action est irréversible.')) return;
    const { error } = await this.home.deleteHomepageExpertiseCard(id);
    if (error) {
      this.toast.error('Erreur lors de la suppression');
    } else {
      this.toast.success('Carte supprimée');
    }
  }

  async moveCard(id: string, direction: 'up' | 'down'): Promise<void> {
    const cards = this.home.homepageExpertiseCards();
    const index = cards.findIndex((c) => c.id === id);
    if (direction === 'up' && index > 0) {
      const prevCard = cards[index - 1];
      await this.home.updateHomepageExpertiseCard(id, { sort_order: prevCard.sort_order });
      await this.home.updateHomepageExpertiseCard(prevCard.id, { sort_order: cards[index].sort_order });
    } else if (direction === 'down' && index < cards.length - 1) {
      const nextCard = cards[index + 1];
      await this.home.updateHomepageExpertiseCard(id, { sort_order: nextCard.sort_order });
      await this.home.updateHomepageExpertiseCard(nextCard.id, { sort_order: cards[index].sort_order });
    }
  }

  startEditImage(key: string): void {
    this.editingImageKey.set(key);
    const img = this.home.homepageImagesMap()[key];
    if (img) {
      this.imageForm = { key, url: img.url, alt_text: img.alt_text };
    }
  }

  cancelEditImage(): void {
    this.editingImageKey.set(null);
    this.selectedImageFile.set(null);
    this.selectedImageKey.set(null);
    this.imageForm = { key: '', url: '', alt_text: '' };
  }

  onImageFileSelected(event: Event, key: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.toast.error('Veuillez sélectionner un fichier image valide');
        return;
      }

      // Validate file size
      if (file.size > this.MAX_SIZE) {
        this.toast.error('Le fichier est trop volumineux (max 5 Mo)');
        return;
      }

      this.selectedImageFile.set(file);
      this.selectedImageKey.set(key);
      this.imageForm.key = key;
    }
  }

  async uploadImage(key: string): Promise<void> {
    const file = this.selectedImageFile();
    if (!file) {
      this.toast.error('Veuillez selectionner un fichier image');
      return;
    }
    this.uploadingImage.set(true);
    try {
      const path = `homepage/${key}-${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
      const { publicUrl, error } = await this.supabase.uploadImage('images', path, file);
      if (error) {
        this.toast.error('Erreur lors de l\'upload: ' + error);
        return;
      }
      if (!publicUrl) {
        this.toast.error('URL publique non disponible apres upload');
        return;
      }
      const { error: dbError } = await this.home.upsertHomepageImage(key, publicUrl, this.imageForm.alt_text);
      if (dbError) {
        this.toast.error('Erreur lors de la sauvegarde en base');
      } else {
        this.toast.success('Image uploadee et sauvegardee');
        this.cancelEditImage();
      }
    } finally {
      this.uploadingImage.set(false);
    }
  }

  onCardIconChange(icon: string): void {
    this.cardForm.icon = icon;
  }
}