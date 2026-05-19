import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { FormsModule } from '@angular/forms';
import { AboutFacade } from '../../../core/about.facade';
import { CompanyFacade } from '../../../core/company.facade';
import { SupabaseService } from '../../../core/supabase.service';
import { ToastService } from '../../../shared/toast/toast.service';
import { LoaderComponent } from '../../../shared/loader/loader.component';
import { SectionCardComponent } from '../../../shared/section-card/section-card.component';
import { EmptyStateComponent } from '../../../shared/empty-state/empty-state.component';
import { FormFieldComponent } from '../../../shared/form-field/form-field.component';

interface AboutImageForm {
  key: string;
  url: string;
  alt_text: string;
}

@Component({
  selector: 'app-about-editor',
  imports: [
    FormField,
    FormsModule,
    LoaderComponent,
    SectionCardComponent,
    EmptyStateComponent,
    FormFieldComponent,
  ],
  templateUrl: './about-editor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutEditorComponent implements OnInit {
  private readonly company = inject(CompanyFacade);
  private readonly about = inject(AboutFacade);
  private readonly supabase = inject(SupabaseService);
  private readonly toast = inject(ToastService);

  // Hero Form
  private aboutHeroModel = signal({ label: '', headline: '', body: '' });
  readonly aboutHeroForm = form(this.aboutHeroModel);

  // Availability Form
  private aboutAvailModel = signal({ label: '', days: '', hours: '' });
  readonly aboutAvailForm = form(this.aboutAvailModel);

  // Mission Form
  private aboutMissionModel = signal({ label: '', quote: '' });
  readonly aboutMissionForm = form(this.aboutMissionModel);

  // Company Form
  private aboutCompanyModel = signal({ label: '', body: '' });
  readonly aboutCompanyForm = form(this.aboutCompanyModel);

  // Services Section Form
  private aboutServicesSectionModel = signal({ headline: '', subtext: '' });
  readonly aboutServicesSectionForm = form(this.aboutServicesSectionModel);

  // Values Section Form
  private aboutValuesSectionModel = signal({ headline: '', subtext: '' });
  readonly aboutValuesSectionForm = form(this.aboutValuesSectionModel);

  // CTA Section Form
  private aboutCtaSectionModel = signal({
    headline: '',
    subtext: '',
    cta_primary_label: '',
    cta_primary_link: '',
    cta_secondary_label: '',
    cta_secondary_link: '',
  });
  readonly aboutCtaSectionForm = form(this.aboutCtaSectionModel);

  aboutImageForm = signal<AboutImageForm>({ key: '', url: '', alt_text: '' });

  // Image editing state
  editingAboutImageKey = signal<string | null>(null);
  selectedImageFile = signal<File | null>(null);
  selectedImageKey = signal<string | null>(null);

  // Loading states
  readonly savingHero = signal(false);
  readonly savingAvailability = signal(false);
  readonly savingMission = signal(false);
  readonly savingCompany = signal(false);
  readonly savingServicesSection = signal(false);
  readonly savingValuesSection = signal(false);
  readonly savingCtaSection = signal(false);
  readonly uploadingImage = signal(false);

  private readonly MAX_SIZE = 5 * 1024 * 1024; // 5MB

  // Expose signals for template
  readonly aboutHero = this.about.aboutHero;
  readonly aboutAvailability = this.about.aboutAvailability;
  readonly aboutMission = this.about.aboutMission;
  readonly aboutCompany = this.about.aboutCompany;
  readonly aboutServicesSection = this.about.aboutServicesSection;
  readonly aboutValuesSection = this.about.aboutValuesSection;
  readonly aboutCtaSection = this.about.aboutCtaSection;
  readonly aboutImages = this.about.aboutImages;
  readonly aboutLoading = this.about.aboutLoading;

  async ngOnInit(): Promise<void> {
    this.company.fetchServices();
    this.company.fetchCompanyValues();
    await this.about.fetchAboutContent();
    this.syncForms();
  }

  private syncForms(): void {
    const h = this.aboutHero();
    if (h) {
      this.aboutHeroModel.set({ label: h.label ?? '', headline: h.headline ?? '', body: h.body ?? '' });
    }
    const a = this.aboutAvailability();
    if (a) {
      this.aboutAvailModel.set({ label: a.label ?? '', days: a.days ?? '', hours: a.hours ?? '' });
    }
    const m = this.aboutMission();
    if (m) {
      this.aboutMissionModel.set({ label: m.label ?? '', quote: m.quote ?? '' });
    }
    const c = this.aboutCompany();
    if (c) {
      this.aboutCompanyModel.set({ label: c.label ?? '', body: c.body ?? '' });
    }
    const ss = this.aboutServicesSection();
    if (ss) {
      this.aboutServicesSectionModel.set({ headline: ss.headline ?? '', subtext: ss.subtext ?? '' });
    }
    const vs = this.aboutValuesSection();
    if (vs) {
      this.aboutValuesSectionModel.set({ headline: vs.headline ?? '', subtext: vs.subtext ?? '' });
    }
    const cs = this.aboutCtaSection();
    if (cs) {
      this.aboutCtaSectionModel.set({
        headline: cs.headline ?? '',
        subtext: cs.subtext ?? '',
        cta_primary_label: cs.cta_primary_label ?? '',
        cta_primary_link: cs.cta_primary_link ?? '',
        cta_secondary_label: cs.cta_secondary_label ?? '',
        cta_secondary_link: cs.cta_secondary_link ?? '',
      });
    }
  }

  async saveAboutHero(): Promise<void> {
    const hero = this.aboutHero();
    if (!hero) return;
    this.savingHero.set(true);
    try {
      const { error } = await this.about.updateAboutHero({
        ...hero,
        ...this.aboutHeroModel(),
      });
      if (error) {
        this.toast.error('Erreur lors de la sauvegarde du hero');
      } else {
        this.toast.success('Section Hero sauvegardee');
      }
    } finally {
      this.savingHero.set(false);
    }
  }

  async saveAboutAvailability(): Promise<void> {
    const avail = this.aboutAvailability();
    if (!avail) return;
    this.savingAvailability.set(true);
    try {
      const { error } = await this.about.updateAboutAvailability({
        ...avail,
        ...this.aboutAvailModel(),
      });
      if (error) {
        this.toast.error('Erreur lors de la sauvegarde');
      } else {
        this.toast.success('Section Disponibilite sauvegardee');
      }
    } finally {
      this.savingAvailability.set(false);
    }
  }

  async saveAboutMission(): Promise<void> {
    const mission = this.aboutMission();
    if (!mission) return;
    this.savingMission.set(true);
    try {
      const { error } = await this.about.updateAboutMission({
        ...mission,
        ...this.aboutMissionModel(),
      });
      if (error) {
        this.toast.error('Erreur lors de la sauvegarde');
      } else {
        this.toast.success('Section Mission sauvegardee');
      }
    } finally {
      this.savingMission.set(false);
    }
  }

  async saveAboutCompany(): Promise<void> {
    const company = this.aboutCompany();
    if (!company) return;
    this.savingCompany.set(true);
    try {
      const { error } = await this.about.updateAboutCompany({
        ...company,
        ...this.aboutCompanyModel(),
      });
      if (error) {
        this.toast.error('Erreur lors de la sauvegarde');
      } else {
        this.toast.success('Section Entreprise sauvegardee');
      }
    } finally {
      this.savingCompany.set(false);
    }
  }

  async saveAboutServicesSection(): Promise<void> {
    const section = this.aboutServicesSection();
    if (!section) return;
    this.savingServicesSection.set(true);
    try {
      const { error } = await this.about.updateAboutServicesSection({
        ...section,
        ...this.aboutServicesSectionModel(),
      });
      if (error) {
        this.toast.error('Erreur lors de la sauvegarde');
      } else {
        this.toast.success('Section Services sauvegardee');
      }
    } finally {
      this.savingServicesSection.set(false);
    }
  }

  async saveAboutValuesSection(): Promise<void> {
    const section = this.aboutValuesSection();
    if (!section) return;
    this.savingValuesSection.set(true);
    try {
      const { error } = await this.about.updateAboutValuesSection({
        ...section,
        ...this.aboutValuesSectionModel(),
      });
      if (error) {
        this.toast.error('Erreur lors de la sauvegarde');
      } else {
        this.toast.success('Section Valeurs sauvegardee');
      }
    } finally {
      this.savingValuesSection.set(false);
    }
  }

  async saveAboutCtaSection(): Promise<void> {
    const section = this.aboutCtaSection();
    if (!section) return;
    this.savingCtaSection.set(true);
    try {
      const { error } = await this.about.updateAboutCtaSection({
        ...section,
        ...this.aboutCtaSectionModel(),
      });
      if (error) {
        this.toast.error('Erreur lors de la sauvegarde');
      } else {
        this.toast.success('Section CTA sauvegardee');
      }
    } finally {
      this.savingCtaSection.set(false);
    }
  }

  startEditAboutImage(key: string): void {
    const img = this.aboutImages().find((i) => i.image_key === key);
    if (img) {
      this.aboutImageForm.set({ key: img.image_key, url: img.url, alt_text: img.alt_text });
      this.editingAboutImageKey.set(key);
      this.selectedImageFile.set(null);
      this.selectedImageKey.set(null);
    }
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
      this.aboutImageForm.update(f => ({ ...f, key }));
    }
  }

  cancelEditAboutImage(): void {
    this.editingAboutImageKey.set(null);
    this.selectedImageFile.set(null);
    this.selectedImageKey.set(null);
    this.aboutImageForm.set({ key: '', url: '', alt_text: '' });
  }

  async uploadAboutImage(): Promise<void> {
    const file = this.selectedImageFile();
    const key = this.selectedImageKey();
    if (!file || !key) {
      this.toast.error('Veuillez selectionner un fichier image');
      return;
    }
    const path = `about/${key}-${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const { publicUrl, error } = await this.supabase.uploadImage('images', path, file);
    if (error) {
      this.toast.error('Erreur lors de l\'upload: ' + error);
      return;
    }
    if (!publicUrl) {
      this.toast.error('URL publique non disponible apres upload');
      return;
    }
    const { error: dbError } = await this.about.upsertAboutImage(key, publicUrl, this.aboutImageForm().alt_text);
    if (dbError) {
      this.toast.error('Erreur lors de la sauvegarde en base');
    } else {
      this.toast.success('Image uploadee et sauvegardee');
      this.cancelEditAboutImage();
    }
  }
}