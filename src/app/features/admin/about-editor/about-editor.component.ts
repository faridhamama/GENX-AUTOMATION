import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AboutFacade } from '../../../core/about.facade';
import { CompanyFacade } from '../../../core/company.facade';
import { SupabaseService } from '../../../core/supabase.service';
import { ToastService } from '../../../shared/toast/toast.service';

interface AboutImageForm {
  key: string;
  url: string;
  alt_text: string;
}

@Component({
  selector: 'app-about-editor',
  imports: [FormsModule],
  templateUrl: './about-editor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutEditorComponent implements OnInit {
  private readonly company = inject(CompanyFacade);
  private readonly about = inject(AboutFacade);
  private readonly supabase = inject(SupabaseService);
  private readonly toast = inject(ToastService);

  // Forms
  aboutHeroForm = { label: '', headline: '', body: '' };
  aboutAvailForm = { label: '', days: '', hours: '' };
  aboutMissionForm = { label: '', quote: '' };
  aboutCompanyForm = { label: '', body: '' };
  aboutServicesSectionForm = { headline: '', subtext: '' };
  aboutValuesSectionForm = { headline: '', subtext: '' };
  aboutCtaSectionForm = {
    headline: '',
    subtext: '',
    cta_primary_label: '',
    cta_primary_link: '',
    cta_secondary_label: '',
    cta_secondary_link: '',
  };
  aboutImageForm: AboutImageForm = { key: '', url: '', alt_text: '' };

  // Image editing state
  editingAboutImageKey = signal<string | null>(null);
  selectedImageFile = signal<File | null>(null);
  selectedImageKey = signal<string | null>(null);

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

  ngOnInit(): void {
    this.company.fetchServices();
    this.company.fetchCompanyValues();
    this.about.fetchAboutContent();
    this.syncForms();
  }

  private syncForms(): void {
    const h = this.aboutHero();
    if (h) {
      this.aboutHeroForm = { label: h.label, headline: h.headline, body: h.body };
    }
    const a = this.aboutAvailability();
    if (a) {
      this.aboutAvailForm = { label: a.label, days: a.days, hours: a.hours };
    }
    const m = this.aboutMission();
    if (m) {
      this.aboutMissionForm = { label: m.label, quote: m.quote };
    }
    const c = this.aboutCompany();
    if (c) {
      this.aboutCompanyForm = { label: c.label, body: c.body };
    }
    const ss = this.aboutServicesSection();
    if (ss) {
      this.aboutServicesSectionForm = { headline: ss.headline, subtext: ss.subtext };
    }
    const vs = this.aboutValuesSection();
    if (vs) {
      this.aboutValuesSectionForm = { headline: vs.headline, subtext: vs.subtext };
    }
    const cs = this.aboutCtaSection();
    if (cs) {
      this.aboutCtaSectionForm = {
        headline: cs.headline,
        subtext: cs.subtext,
        cta_primary_label: cs.cta_primary_label,
        cta_primary_link: cs.cta_primary_link,
        cta_secondary_label: cs.cta_secondary_label,
        cta_secondary_link: cs.cta_secondary_link,
      };
    }
  }

  async saveAboutHero(): Promise<void> {
    const hero = this.aboutHero();
    if (!hero) return;
    const { error } = await this.about.updateAboutHero({
      ...hero,
      ...this.aboutHeroForm,
    });
    if (error) {
      this.toast.error();
    } else {
      this.toast.success('Section Hero sauvegardee');
    }
  }

  async saveAboutAvailability(): Promise<void> {
    const avail = this.aboutAvailability();
    if (!avail) return;
    const { error } = await this.about.updateAboutAvailability({
      ...avail,
      ...this.aboutAvailForm,
    });
    if (error) {
      this.toast.error();
    } else {
      this.toast.success('Section Disponibilite sauvegardee');
    }
  }

  async saveAboutMission(): Promise<void> {
    const mission = this.aboutMission();
    if (!mission) return;
    const { error } = await this.about.updateAboutMission({
      ...mission,
      ...this.aboutMissionForm,
    });
    if (error) {
      this.toast.error();
    } else {
      this.toast.success('Section Mission sauvegardee');
    }
  }

  async saveAboutCompany(): Promise<void> {
    const company = this.aboutCompany();
    if (!company) return;
    const { error } = await this.about.updateAboutCompany({
      ...company,
      ...this.aboutCompanyForm,
    });
    if (error) {
      this.toast.error();
    } else {
      this.toast.success('Section Entreprise sauvegardee');
    }
  }

  async saveAboutServicesSection(): Promise<void> {
    const section = this.aboutServicesSection();
    if (!section) return;
    const { error } = await this.about.updateAboutServicesSection({
      ...section,
      ...this.aboutServicesSectionForm,
    });
    if (error) {
      this.toast.error();
    } else {
      this.toast.success('Section Services sauvegardee');
    }
  }

  async saveAboutValuesSection(): Promise<void> {
    const section = this.aboutValuesSection();
    if (!section) return;
    const { error } = await this.about.updateAboutValuesSection({
      ...section,
      ...this.aboutValuesSectionForm,
    });
    if (error) {
      this.toast.error();
    } else {
      this.toast.success('Section Valeurs sauvegardee');
    }
  }

  async saveAboutCtaSection(): Promise<void> {
    const section = this.aboutCtaSection();
    if (!section) return;
    const { error } = await this.about.updateAboutCtaSection({
      ...section,
      ...this.aboutCtaSectionForm,
    });
    if (error) {
      this.toast.error();
    } else {
      this.toast.success('Section CTA sauvegardee');
    }
  }

  startEditAboutImage(key: string): void {
    const img = this.aboutImages().find((i) => i.image_key === key);
    if (img) {
      this.aboutImageForm = { key: img.image_key, url: img.url, alt_text: img.alt_text };
      this.editingAboutImageKey.set(key);
      this.selectedImageFile.set(null);
      this.selectedImageKey.set(null);
    }
  }

  onImageFileSelected(event: Event, key: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedImageFile.set(input.files[0]);
      this.selectedImageKey.set(key);
      this.aboutImageForm.key = key;
    }
  }

  cancelEditAboutImage(): void {
    this.editingAboutImageKey.set(null);
    this.selectedImageFile.set(null);
    this.selectedImageKey.set(null);
    this.aboutImageForm = { key: '', url: '', alt_text: '' };
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
    const { error: dbError } = await this.about.upsertAboutImage(key, publicUrl, this.aboutImageForm.alt_text);
    if (dbError) {
      this.toast.error('Erreur lors de la sauvegarde en base');
    } else {
      this.toast.success('Image uploadee et sauvegardee');
      this.cancelEditAboutImage();
    }
  }
}
