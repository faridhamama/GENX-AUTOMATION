import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { FormsModule } from '@angular/forms';
import { CompanyFacade } from '../../../core/company.facade';
import { ReferencesFacade } from '../../../core/references.facade';
import { SupabaseService } from '../../../core/supabase.service';
import { ToastService } from '../../../shared/toast/toast.service';
import { SectionCardComponent } from '../../../shared/section-card/section-card.component';
import { EmptyStateComponent } from '../../../shared/empty-state/empty-state.component';
import { IconSelectComponent } from '../../../shared/icon-select/icon-select.component';
import { FormFieldComponent } from '../../../shared/form-field/form-field.component';

function generateId(): string {
  return crypto.randomUUID();
}

@Component({
  selector: 'app-references-editor',
  imports: [
    FormField,
    FormsModule,
    SectionCardComponent,
    EmptyStateComponent,
    IconSelectComponent,
    FormFieldComponent,
  ],
  templateUrl: './references-editor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReferencesEditorComponent implements OnInit {
  private readonly company = inject(CompanyFacade);
  private readonly refs = inject(ReferencesFacade);
  private readonly supabase = inject(SupabaseService);
  private readonly toast = inject(ToastService);

  // Data signals from facades
  readonly referencesHero = this.refs.referencesHero;
  readonly referencesFeaturedProject = this.refs.referencesFeaturedProject;
  readonly referencesPerformanceStats = this.refs.referencesPerformanceStats;
  readonly referencesSideProjects = this.refs.referencesSideProjects;
  readonly referencesQualityPoints = this.refs.referencesQualityPoints;
  readonly referencesImages = this.refs.referencesImages;
  readonly services = this.company.services;

  // Hero Form - Signal Form
  private heroModel = signal({ label: '', headline: '', body: '' });
  readonly referencesHeroForm = form(this.heroModel);

  // Featured Project Form - Signal Form
  private featuredProjectModel = signal({
    sector: '',
    title: '',
    technology: '',
    tech_label: '',
    specs_json: '',
    image_key: '',
    image_alt: '',
    result: '',
  });
  readonly featuredProjectForm = form(this.featuredProjectModel);

  readonly refImageForm = signal({ key: '', url: '', alt_text: '' });

  // Editing states
  readonly editingRefImageKey = signal<string | null>(null);
  readonly editingPerfStatId = signal<string | null>(null);
  readonly editingSideProjectId = signal<string | null>(null);
  readonly editingQualityPointId = signal<string | null>(null);
  readonly selectedImageFile = signal<File | null>(null);
  readonly selectedImageKey = signal<string | null>(null);

  // Adding new states
  readonly addingSideProject = signal(false);
  readonly addingQualityPoint = signal(false);

  // Loading states
  readonly savingHero = signal(false);
  readonly savingFeaturedProject = signal(false);
  readonly savingPerfStat = signal(false);
  readonly savingSideProject = signal(false);
  readonly savingQualityPoint = signal(false);
  readonly uploadingImage = signal(false);

  private readonly MAX_SIZE = 5 * 1024 * 1024; // 5MB

  // Inline edit forms
  readonly perfStatForm = signal({ value: '', label: '' });
  readonly sideProjectForm = signal({ sector: '', title: '', description: '', key_spec: '' });
  readonly qualityPointForm = signal({ icon: '', title: '', description: '' });

  ngOnInit(): void {
    this.refs.fetchReferencesContent();
    this.company.fetchServices();
  }

  // Hero methods
  initHeroForm(): void {
    const hero = this.referencesHero();
    if (hero) {
      this.heroModel.set({
        label: hero.label ?? '',
        headline: hero.headline ?? '',
        body: hero.body ?? '',
      });
    }
  }

  async saveReferencesHero(): Promise<void> {
    const { label, headline, body } = this.heroModel();
    if (!label.trim() || !headline.trim()) return;

    const hero = this.referencesHero();
    if (!hero) return;

    this.savingHero.set(true);
    try {
      const payload: typeof hero = {
        ...hero,
        label: label.trim(),
        headline: headline.trim(),
        body: body.trim(),
      };

      const { error } = await this.refs.updateReferencesHero(payload);
      if (error) {
        this.toast.error('Erreur lors de la mise a jour du hero references');
        return;
      }
      this.toast.success('Hero references mis a jour');
    } finally {
      this.savingHero.set(false);
    }
  }

  // Featured project methods
  initFeaturedProjectForm(): void {
    const project = this.referencesFeaturedProject();
    if (project) {
      this.featuredProjectModel.set({
        sector: project.sector ?? '',
        title: project.title ?? '',
        technology: project.technology ?? '',
        tech_label: project.tech_label ?? '',
        specs_json: project.specs_json ?? '',
        image_key: project.image_key ?? '',
        image_alt: project.image_alt ?? '',
        result: project.result ?? '',
      });
    }
  }

  async saveFeaturedProject(): Promise<void> {
    const form = this.featuredProjectModel();
    if (!form.title.trim() || !form.sector.trim()) return;

    const project = this.referencesFeaturedProject();
    if (!project) return;

    this.savingFeaturedProject.set(true);
    try {
      const payload: typeof project = {
        ...project,
        sector: form.sector.trim(),
        title: form.title.trim(),
        technology: form.technology.trim(),
        tech_label: form.tech_label.trim(),
        specs_json: form.specs_json.trim(),
        image_key: form.image_key.trim(),
        image_alt: form.image_alt.trim(),
        result: form.result.trim(),
      };

      const { error } = await this.refs.updateReferencesFeaturedProject(payload);
      if (error) {
        this.toast.error('Erreur lors de la mise a jour du projet en vedette');
        return;
      }
      this.toast.success('Projet en vedette mis a jour');
    } finally {
      this.savingFeaturedProject.set(false);
    }
  }

  // Performance stats methods
  startEditPerfStat(id: string): void {
    const stat = this.referencesPerformanceStats().find((s) => s.id === id);
    if (!stat) return;
    this.perfStatForm.update(f => ({ ...f, value: stat.value, label: stat.label }));
    this.editingPerfStatId.set(id);
  }

  cancelEditPerfStat(): void {
    this.editingPerfStatId.set(null);
    this.perfStatForm.update(f => ({ ...f, value: '', label: '' }));
  }

  async savePerfStat(): Promise<void> {
    const id = this.editingPerfStatId();
    if (!id) return;
    const { value, label } = this.perfStatForm();
    const trimmedValue = value.trim();
    const trimmedLabel = label.trim();
    if (!trimmedValue || !trimmedLabel) return;

    this.savingPerfStat.set(true);
    try {
      const { error } = await this.refs.updateReferencesPerformanceStat({ id, value: trimmedValue, label: trimmedLabel });
      if (error) {
        this.toast.error('Erreur lors de la mise a jour de la statistique');
        return;
      }
      this.toast.success('Statistique mise a jour');
      this.cancelEditPerfStat();
    } finally {
      this.savingPerfStat.set(false);
    }
  }

  // Side projects methods
  startEditSideProject(id: string): void {
    const project = this.referencesSideProjects().find((p) => p.id === id);
    if (!project) return;
    this.sideProjectForm.update(f => ({
      ...f,
      sector: project.sector,
      title: project.title,
      description: project.description,
      key_spec: project.key_spec,
    }));
    this.editingSideProjectId.set(id);
  }

  cancelEditSideProject(): void {
    this.editingSideProjectId.set(null);
    this.sideProjectForm.update(f => ({ ...f, sector: '', title: '', description: '', key_spec: '' }));
  }

  async saveSideProject(): Promise<void> {
    const id = this.editingSideProjectId();
    if (!id) return;
    const { sector, title, description, key_spec } = this.sideProjectForm();
    const trimmedSector = sector.trim();
    const trimmedTitle = title.trim();
    if (!trimmedTitle || !trimmedSector) return;

    this.savingSideProject.set(true);
    try {
      const { error } = await this.refs.updateReferencesSideProject(id, {
        sector: trimmedSector,
        title: trimmedTitle,
        description: description.trim(),
        key_spec: key_spec.trim(),
      });
      if (error) {
        this.toast.error('Erreur lors de la mise a jour du projet parallele');
        return;
      }
      this.toast.success('Projet parallel mis a jour');
      this.cancelEditSideProject();
    } finally {
      this.savingSideProject.set(false);
    }
  }

  async deleteSideProject(id: string): Promise<void> {
    if (!confirm('Supprimer ce projet parallele ?')) return;
    const { error } = await this.refs.deleteReferencesSideProject(id);
    if (error) {
      this.toast.error('Erreur lors de la suppression');
      return;
    }
    this.toast.success('Projet parallel supprime');
    if (this.editingSideProjectId() === id) this.cancelEditSideProject();
  }

  // Add new side project methods
  startAddSideProject(): void {
    this.sideProjectForm.update(f => ({ ...f, sector: '', title: '', description: '', key_spec: '' }));
    this.addingSideProject.set(true);
  }

  cancelAddSideProject(): void {
    this.addingSideProject.set(false);
    this.sideProjectForm.update(f => ({ ...f, sector: '', title: '', description: '', key_spec: '' }));
  }

  async saveNewSideProject(): Promise<void> {
    const { sector, title, description, key_spec } = this.sideProjectForm();
    const trimmedSector = sector.trim();
    const trimmedTitle = title.trim();
    if (!trimmedTitle || !trimmedSector) return;

    this.savingSideProject.set(true);
    try {
      const { error } = await this.refs.createReferencesSideProject({
        id: generateId(),
        sector: trimmedSector,
        title: trimmedTitle,
        description: description.trim(),
        key_spec: key_spec.trim(),
        sort_order: 0,
      });
      if (error) {
        this.toast.error('Erreur lors de la creation du projet parallel');
        return;
      }
      this.toast.success('Projet parallel cree');
      this.cancelAddSideProject();
    } finally {
      this.savingSideProject.set(false);
    }
  }

  // Quality points methods
  startEditQualityPoint(id: string): void {
    const point = this.referencesQualityPoints().find((p) => p.id === id);
    if (!point) return;
    this.qualityPointForm.update(f => ({
      ...f,
      icon: point.icon,
      title: point.title,
      description: point.description,
    }));
    this.editingQualityPointId.set(id);
  }

  cancelEditQualityPoint(): void {
    this.editingQualityPointId.set(null);
    this.qualityPointForm.update(f => ({ ...f, icon: '', title: '', description: '' }));
  }

  async saveQualityPoint(): Promise<void> {
    const id = this.editingQualityPointId();
    if (!id) return;
    const { icon, title, description } = this.qualityPointForm();
    const trimmedIcon = icon.trim();
    const trimmedTitle = title.trim();
    if (!trimmedIcon || !trimmedTitle) return;

    this.savingQualityPoint.set(true);
    try {
      const { error } = await this.refs.updateReferencesQualityPoint(id, {
        icon: trimmedIcon,
        title: trimmedTitle,
        description: description.trim(),
      });
      if (error) {
        this.toast.error('Erreur lors de la mise a jour du point qualite');
        return;
      }
      this.toast.success('Point qualite mis a jour');
      this.cancelEditQualityPoint();
    } finally {
      this.savingQualityPoint.set(false);
    }
  }

  async deleteQualityPoint(id: string): Promise<void> {
    if (!confirm('Supprimer ce point qualite ?')) return;
    const { error } = await this.refs.deleteReferencesQualityPoint(id);
    if (error) {
      this.toast.error('Erreur lors de la suppression');
      return;
    }
    this.toast.success('Point qualite supprime');
    if (this.editingQualityPointId() === id) this.cancelEditQualityPoint();
  }

  // Add new quality point methods
  startAddQualityPoint(): void {
    this.qualityPointForm.update(f => ({ ...f, icon: '', title: '', description: '' }));
    this.addingQualityPoint.set(true);
  }

  cancelAddQualityPoint(): void {
    this.addingQualityPoint.set(false);
    this.qualityPointForm.update(f => ({ ...f, icon: '', title: '', description: '' }));
  }

  async saveNewQualityPoint(): Promise<void> {
    const { icon, title, description } = this.qualityPointForm();
    const trimmedIcon = icon.trim();
    const trimmedTitle = title.trim();
    if (!trimmedIcon || !trimmedTitle) return;

    this.savingQualityPoint.set(true);
    try {
      const { error } = await this.refs.createReferencesQualityPoint({
        id: generateId(),
        icon: trimmedIcon,
        title: trimmedTitle,
        description: description.trim(),
        sort_order: 0,
      });
      if (error) {
        this.toast.error('Erreur lors de la creation du point qualite');
        return;
      }
      this.toast.success('Point qualite cree');
      this.cancelAddQualityPoint();
    } finally {
      this.savingQualityPoint.set(false);
    }
  }

  // References images methods
  startEditRefImage(key: string): void {
    const image = this.refs.referencesImagesMap()[key];
    if (!image) return;
    this.refImageForm.set({ key, url: image.url, alt_text: image.alt_text });
    this.editingRefImageKey.set(key);
    this.selectedImageFile.set(null);
    this.selectedImageKey.set(null);
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
      this.refImageForm.update(f => ({ ...f, key }));
    }
  }

  cancelEditRefImage(): void {
    this.editingRefImageKey.set(null);
    this.selectedImageFile.set(null);
    this.selectedImageKey.set(null);
    this.refImageForm.set({ key: '', url: '', alt_text: '' });
  }

  async uploadRefImage(): Promise<void> {
    const file = this.selectedImageFile();
    const key = this.selectedImageKey();
    if (!file || !key) {
      this.toast.error('Veuillez selectionner un fichier image');
      return;
    }
    this.uploadingImage.set(true);
    try {
      const path = `references/${key}-${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
      const { publicUrl, error } = await this.supabase.uploadImage('images', path, file);
      if (error) {
        this.toast.error('Erreur lors de l\'upload: ' + error);
        return;
      }
      if (!publicUrl) {
        this.toast.error('URL publique non disponible apres upload');
        return;
      }
      const { error: dbError } = await this.refs.upsertReferencesImage(key, publicUrl, this.refImageForm().alt_text);
      if (dbError) {
        this.toast.error('Erreur lors de la sauvegarde en base');
      } else {
        this.toast.success('Image uploadee et sauvegardee');
        this.cancelEditRefImage();
      }
    } finally {
      this.uploadingImage.set(false);
    }
  }

  onQualityPointIconChange(icon: string): void {
    this.qualityPointForm.update(f => ({ ...f, icon }));
  }
}