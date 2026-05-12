import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CompanyFacade } from '../../../core/company.facade';
import { HomeFacade } from '../../../core/home.facade';
import { ToastService } from '../../../shared/toast/toast.service';

@Component({
  selector: 'app-home-editor',
  imports: [FormsModule],
  templateUrl: './home-editor.component.html',
  styleUrl: './home-editor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeEditorComponent implements OnInit {
  readonly company = inject(CompanyFacade);
  readonly home = inject(HomeFacade);
  readonly toast = inject(ToastService);

  // Signals
  readonly editingCardId = signal<string | null>(null);
  readonly showAddCard = signal(false);
  readonly editingImageKey = signal<string | null>(null);

  // Homepage hero content form (badge, headline, body, CTAs, expertise section, CTA section)
  heroContentForm: {
    hero_badge: string;
    hero_headline: string;
    hero_body: string;
    cta_primary_label: string;
    cta_secondary_label: string;
    stats_image_caption: string;
    expertise_label: string;
    expertise_headline: string;
    expertise_subtext: string;
    cta_section_headline: string;
    cta_section_body: string;
    cta_section_label: string;
  } = {
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
  };

  // Hero stats form
  heroStatsForm: {
    stat1_label: string;
    stat1_value: string;
    stat1_sub: string;
    stat2_label: string;
    stat2_value: string;
    stat2_sub: string;
  } = {
    stat1_label: '',
    stat1_value: '',
    stat1_sub: '',
    stat2_label: '',
    stat2_value: '',
    stat2_sub: '',
  };

  // Expertise card form
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
      this.heroContentForm = {
        hero_badge: content.hero_badge,
        hero_headline: content.hero_headline,
        hero_body: content.hero_body,
        cta_primary_label: content.cta_primary_label,
        cta_secondary_label: content.cta_secondary_label,
        stats_image_caption: content.stats_image_caption,
        expertise_label: content.expertise_label,
        expertise_headline: content.expertise_headline,
        expertise_subtext: content.expertise_subtext,
        cta_section_headline: content.cta_section_headline,
        cta_section_body: content.cta_section_body,
        cta_section_label: content.cta_section_label,
      };
    }
  }

  async saveHeroContent(): Promise<void> {
    const content = this.home.homepageHeroContent();
    if (!content) return;
    const { error } = await this.home.updateHomepageHeroContent({
      ...content,
      ...this.heroContentForm,
    });
    if (error) {
      this.toast.error();
    } else {
      this.toast.success('Contenu hero sauvegarde');
    }
  }

  private syncHeroStatsForm(): void {
    const stats = this.home.homepageHeroStats();
    if (stats) {
      this.heroStatsForm = {
        stat1_label: stats.stat1_label,
        stat1_value: stats.stat1_value,
        stat1_sub: stats.stat1_sub,
        stat2_label: stats.stat2_label,
        stat2_value: stats.stat2_value,
        stat2_sub: stats.stat2_sub,
      };
    }
  }

  async saveHeroStats(): Promise<void> {
    const stats = this.home.homepageHeroStats();
    if (!stats) return;
    const { error } = await this.home.updateHomepageHeroStats({
      ...stats,
      ...this.heroStatsForm,
    });
    if (error) {
      this.toast.error();
    } else {
      this.toast.success('Statistiques sauvegardees');
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
      const { error } = await this.home.updateHomepageExpertiseCard(editingId, {
        icon: this.cardForm.icon,
        title: this.cardForm.title,
        description: this.cardForm.description,
        tags,
      });
      if (error) {
        this.toast.error();
      } else {
        this.toast.success('Carte mise a jour');
        this.cancelEditCard();
      }
    } else {
      // Adding a new card - would need create method; for now show error if not implemented
      this.toast.error('Creation de carte non implantee');
    }
  }

  async deleteCard(id: string): Promise<void> {
    const { error } = await this.home.deleteHomepageExpertiseCard(id);
    if (error) {
      this.toast.error();
    } else {
      this.toast.success('Carte supprimee');
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
    this.imageForm = { key: '', url: '', alt_text: '' };
  }

  async saveImage(): Promise<void> {
    const { error } = await this.home.upsertHomepageImage(
      this.imageForm.key,
      this.imageForm.url,
      this.imageForm.alt_text,
    );
    if (error) {
      this.toast.error();
    } else {
      this.toast.success('Image sauvegardee');
      this.cancelEditImage();
    }
  }
}