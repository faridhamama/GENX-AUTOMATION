import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { FormsModule } from '@angular/forms';
import { CompanyFacade } from '../../../core/company.facade';
import { ServicesPageFacade } from '../../../core/services-page.facade';
import { SupabaseService } from '../../../core/supabase.service';
import { ToastService } from '../../../shared/toast/toast.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormField, FormsModule],
  templateUrl: './services-editor.component.html',
})
export class ServicesEditorComponent implements OnInit {
  private readonly company = inject(CompanyFacade);
  private readonly servicesPage = inject(ServicesPageFacade);
  private readonly supabase = inject(SupabaseService);
  private readonly toast = inject(ToastService);

  protected readonly servicesPageHero = this.servicesPage.servicesPageHero;
  protected readonly servicesMethodology = this.servicesPage.servicesMethodology;
  protected readonly methodologySteps = this.servicesPage.methodologySteps;
  protected readonly servicesImages = this.servicesPage.servicesImages;

  // Hero Form
  private heroModel = signal({
    label: '',
    headline: '',
    body: '',
  });
  readonly servicesHeroForm = form(this.heroModel);

  // Methodology Form
  private methodologyModel = signal({
    section_label: '',
    headline: '',
    subtext: '',
  });
  readonly servicesMethodologyForm = form(this.methodologyModel);

  editingServicesImageKey = signal<string | null>(null);
  servicesImageForm = {
    key: '',
    url: '',
    alt_text: '',
  };
  selectedImageFile = signal<File | null>(null);
  selectedImageKey = signal<string | null>(null);

  ngOnInit(): void {
    this.servicesPage.fetchServicesContent();
    // Auto-load forms once data is available
    setTimeout(() => {
      this.syncHeroForm();
      this.syncMethodologyForm();
    }, 500);
  }

  protected syncHeroForm(): void {
    const hero = this.servicesPageHero();
    if (hero) {
      this.heroModel.set({
        label: hero.label ?? '',
        headline: hero.headline ?? '',
        body: hero.body ?? '',
      });
    }
  }

  protected async saveServicesHero(): Promise<void> {
    const hero = this.servicesPageHero();
    if (!hero) return;

    const { error } = await this.servicesPage.updateServicesPageHero({
      ...hero,
      ...this.heroModel(),
    });

    if (error) {
      this.toast.error('Erreur lors de la sauvegarde');
    } else {
      this.toast.success('Hero enregistré');
    }
  }

  protected syncMethodologyForm(): void {
    const meth = this.servicesMethodology();
    if (meth) {
      this.methodologyModel.set({
        section_label: meth.section_label ?? '',
        headline: meth.headline ?? '',
        subtext: meth.subtext ?? '',
      });
    }
  }

  protected async saveServicesMethodology(): Promise<void> {
    const meth = this.servicesMethodology();
    if (!meth) return;

    const { error } = await this.servicesPage.updateServicesMethodology({
      ...meth,
      ...this.methodologyModel(),
    });

    if (error) {
      this.toast.error('Erreur lors de la sauvegarde');
    } else {
      this.toast.success('Méthodologie enregistrée');
    }
  }

  protected async saveMethodologyStep(step: { id: string; step_number: number; title: string; description: string }): Promise<void> {
    const { error } = await this.servicesPage.updateMethodologyStep(step.id, {
      step_number: step.step_number,
      title: step.title,
      description: step.description,
    });

    if (error) {
      this.toast.error('Erreur lors de la sauvegarde');
    } else {
      this.toast.success('Étape enregistrée');
    }
  }

  protected startEditServicesImage(key: string): void {
    const img = this.servicesImages().find((i) => i.image_key === key);
    if (img) {
      this.editingServicesImageKey.set(key);
      this.servicesImageForm = {
        key: img.image_key,
        url: img.url,
        alt_text: img.alt_text,
      };
      this.selectedImageFile.set(null);
      this.selectedImageKey.set(null);
    }
  }

  protected onImageFileSelected(event: Event, key: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedImageFile.set(input.files[0]);
      this.selectedImageKey.set(key);
      this.servicesImageForm.key = key;
    }
  }

  protected cancelEditServicesImage(): void {
    this.editingServicesImageKey.set(null);
    this.selectedImageFile.set(null);
    this.selectedImageKey.set(null);
    this.servicesImageForm = { key: '', url: '', alt_text: '' };
  }

  protected async uploadServicesImage(): Promise<void> {
    const file = this.selectedImageFile();
    const key = this.selectedImageKey();
    if (!file || !key) {
      this.toast.error('Veuillez selectionner un fichier image');
      return;
    }
    const path = `services/${key}-${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const { publicUrl, error } = await this.supabase.uploadImage('images', path, file);
    if (error) {
      this.toast.error('Erreur lors de l\'upload: ' + error);
      return;
    }
    if (!publicUrl) {
      this.toast.error('URL publique non disponible apres upload');
      return;
    }
    const { error: dbError } = await this.servicesPage.upsertServicesImage(key, publicUrl, this.servicesImageForm.alt_text);
    if (dbError) {
      this.toast.error('Erreur lors de la sauvegarde en base');
    } else {
      this.toast.success('Image uploadee et sauvegardee');
      this.cancelEditServicesImage();
    }
  }
}