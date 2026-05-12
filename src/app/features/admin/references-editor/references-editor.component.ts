import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CompanyFacade } from '../../../core/company.facade';
import { ReferencesFacade } from '../../../core/references.facade';
import { ToastService } from '../../../shared/toast/toast.service';

@Component({
  selector: 'app-references-editor',
  imports: [FormsModule],
  templateUrl: './references-editor.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReferencesEditorComponent implements OnInit {
  private readonly company = inject(CompanyFacade);
  private readonly refs = inject(ReferencesFacade);
  private readonly toast = inject(ToastService);

  // Data signals from facades
  readonly referencesHero = this.refs.referencesHero;
  readonly referencesFeaturedProject = this.refs.referencesFeaturedProject;
  readonly referencesPerformanceStats = this.refs.referencesPerformanceStats;
  readonly referencesSideProjects = this.refs.referencesSideProjects;
  readonly referencesQualityPoints = this.refs.referencesQualityPoints;
  readonly referencesImages = this.refs.referencesImages;
  readonly services = this.company.services;

  // Forms
  readonly referencesHeroForm = { label: '', headline: '', body: '' };
  readonly featuredProjectForm = {
    sector: '',
    title: '',
    technology: '',
    tech_label: '',
    specs_json: '',
    image_key: '',
    image_alt: '',
    result: '',
  };
  readonly refImageForm = { key: '', url: '', alt_text: '' };

  // Editing states
  readonly editingRefImageKey = signal<string | null>(null);
  readonly editingPerfStatId = signal<string | null>(null);
  readonly editingSideProjectId = signal<string | null>(null);
  readonly editingQualityPointId = signal<string | null>(null);

  // Inline edit forms
  readonly perfStatForm = { value: '', label: '' };
  readonly sideProjectForm = { sector: '', title: '', description: '', key_spec: '' };
  readonly qualityPointForm = { icon: '', title: '', description: '' };

  readonly availableIcons = [
    'engineering',
    'handshake',
    'workspace_premium',
    'precision_manufacturing',
    'monitoring',
    'support_agent',
    'verified',
    'security',
    'bolt',
    'build',
    'settings',
    'stars',
  ];

  ngOnInit(): void {
    this.refs.fetchReferencesContent();
    this.company.fetchServices();
  }

  // Hero methods
  initHeroForm(): void {
    const hero = this.referencesHero();
    if (hero) {
      this.referencesHeroForm.label = hero.label;
      this.referencesHeroForm.headline = hero.headline;
      this.referencesHeroForm.body = hero.body;
    }
  }

  async saveReferencesHero(): Promise<void> {
    const { label, headline, body } = this.referencesHeroForm;
    if (!label.trim() || !headline.trim()) return;

    const hero = this.referencesHero();
    if (!hero) return;

    const payload: typeof hero = {
      ...hero,
      label: label.trim(),
      headline: headline.trim(),
      body: body.trim(),
    };

    const { error } = await this.refs.updateReferencesHero(payload);
    if (error) {
      this.toast.error();
      return;
    }
    this.toast.success('Hero references mis a jour');
  }

  // Featured project methods
  initFeaturedProjectForm(): void {
    const project = this.referencesFeaturedProject();
    if (project) {
      this.featuredProjectForm.sector = project.sector;
      this.featuredProjectForm.title = project.title;
      this.featuredProjectForm.technology = project.technology;
      this.featuredProjectForm.tech_label = project.tech_label;
      this.featuredProjectForm.specs_json = project.specs_json;
      this.featuredProjectForm.image_key = project.image_key;
      this.featuredProjectForm.image_alt = project.image_alt;
      this.featuredProjectForm.result = project.result;
    }
  }

  async saveFeaturedProject(): Promise<void> {
    const form = this.featuredProjectForm;
    if (!form.title.trim() || !form.sector.trim()) return;

    const project = this.referencesFeaturedProject();
    if (!project) return;

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
      this.toast.error();
      return;
    }
    this.toast.success('Projet en vedette mis a jour');
  }

  // Performance stats methods
  startEditPerfStat(id: string): void {
    const stat = this.referencesPerformanceStats().find((s) => s.id === id);
    if (!stat) return;
    this.perfStatForm.value = stat.value;
    this.perfStatForm.label = stat.label;
    this.editingPerfStatId.set(id);
  }

  cancelEditPerfStat(): void {
    this.editingPerfStatId.set(null);
    this.perfStatForm.value = '';
    this.perfStatForm.label = '';
  }

  async savePerfStat(): Promise<void> {
    const id = this.editingPerfStatId();
    if (!id) return;
    const value = this.perfStatForm.value.trim();
    const label = this.perfStatForm.label.trim();
    if (!value || !label) return;

    const { error } = await this.refs.updateReferencesPerformanceStat({ id, value, label });
    if (error) {
      this.toast.error();
      return;
    }
    this.toast.success('Statistique mise a jour');
    this.cancelEditPerfStat();
  }

  // Side projects methods
  startEditSideProject(id: string): void {
    const project = this.referencesSideProjects().find((p) => p.id === id);
    if (!project) return;
    this.sideProjectForm.sector = project.sector;
    this.sideProjectForm.title = project.title;
    this.sideProjectForm.description = project.description;
    this.sideProjectForm.key_spec = project.key_spec;
    this.editingSideProjectId.set(id);
  }

  cancelEditSideProject(): void {
    this.editingSideProjectId.set(null);
    this.sideProjectForm.sector = '';
    this.sideProjectForm.title = '';
    this.sideProjectForm.description = '';
    this.sideProjectForm.key_spec = '';
  }

  async saveSideProject(): Promise<void> {
    const id = this.editingSideProjectId();
    if (!id) return;
    const { sector, title, description, key_spec } = this.sideProjectForm;
    if (!title.trim() || !sector.trim()) return;

    const { error } = await this.refs.updateReferencesSideProject(id, {
      sector: sector.trim(),
      title: title.trim(),
      description: description.trim(),
      key_spec: key_spec.trim(),
    });
    if (error) {
      this.toast.error();
      return;
    }
    this.toast.success('Projet parallel mis a jour');
    this.cancelEditSideProject();
  }

  async deleteSideProject(id: string): Promise<void> {
    const { error } = await this.refs.deleteReferencesSideProject(id);
    if (error) {
      this.toast.error();
      return;
    }
    this.toast.success('Projet parallel supprime');
    if (this.editingSideProjectId() === id) this.cancelEditSideProject();
  }

  // Quality points methods
  startEditQualityPoint(id: string): void {
    const point = this.referencesQualityPoints().find((p) => p.id === id);
    if (!point) return;
    this.qualityPointForm.icon = point.icon;
    this.qualityPointForm.title = point.title;
    this.qualityPointForm.description = point.description;
    this.editingQualityPointId.set(id);
  }

  cancelEditQualityPoint(): void {
    this.editingQualityPointId.set(null);
    this.qualityPointForm.icon = '';
    this.qualityPointForm.title = '';
    this.qualityPointForm.description = '';
  }

  async saveQualityPoint(): Promise<void> {
    const id = this.editingQualityPointId();
    if (!id) return;
    const { icon, title, description } = this.qualityPointForm;
    if (!icon.trim() || !title.trim()) return;

    const { error } = await this.refs.updateReferencesQualityPoint(id, {
      icon: icon.trim(),
      title: title.trim(),
      description: description.trim(),
    });
    if (error) {
      this.toast.error();
      return;
    }
    this.toast.success('Point qualite mis a jour');
    this.cancelEditQualityPoint();
  }

  // References images methods
  startEditRefImage(key: string): void {
    const image = this.refs.referencesImagesMap()[key];
    if (!image) return;
    this.refImageForm.key = key;
    this.refImageForm.url = image.url;
    this.refImageForm.alt_text = image.alt_text;
    this.editingRefImageKey.set(key);
  }

  cancelEditRefImage(): void {
    this.editingRefImageKey.set(null);
    this.refImageForm.key = '';
    this.refImageForm.url = '';
    this.refImageForm.alt_text = '';
  }

  async saveRefImage(): Promise<void> {
    const key = this.refImageForm.key.trim();
    const url = this.refImageForm.url.trim();
    const alt_text = this.refImageForm.alt_text.trim();
    if (!key || !url) return;

    const { error } = await this.refs.upsertReferencesImage(key, url, alt_text);
    if (error) {
      this.toast.error();
      return;
    }
    this.toast.success('Image mise a jour');
    this.cancelEditRefImage();
  }
}
