import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CompanyFacade } from '../../../core/company.facade';
import { ServicesPageFacade } from '../../../core/services-page.facade';
import { ToastService } from '../../../shared/toast/toast.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  templateUrl: './services-editor.component.html',
})
export class ServicesEditorComponent implements OnInit {
  private readonly company = inject(CompanyFacade);
  private readonly servicesPage = inject(ServicesPageFacade);
  private readonly toast = inject(ToastService);

  protected readonly servicesPageHero = this.servicesPage.servicesPageHero;
  protected readonly servicesMethodology = this.servicesPage.servicesMethodology;
  protected readonly methodologySteps = this.servicesPage.methodologySteps;
  protected readonly servicesImages = this.servicesPage.servicesImages;

  servicesHeroForm = {
    label: '',
    headline: '',
    body: '',
  };

  servicesMethodologyForm = {
    section_label: '',
    headline: '',
    subtext: '',
  };

  editingServicesImageKey = signal<string | null>(null);
  servicesImageForm = {
    key: '',
    url: '',
    alt_text: '',
  };

  ngOnInit(): void {
    this.servicesPage.fetchServicesContent();
  }

  protected setupHeroForm(): void {
    const hero = this.servicesPageHero();
    if (hero) {
      this.servicesHeroForm = {
        label: hero.label ?? '',
        headline: hero.headline ?? '',
        body: hero.body ?? '',
      };
    }
  }

  protected async saveServicesHero(): Promise<void> {
    const hero = this.servicesPageHero();
    if (!hero) return;

    const { error } = await this.servicesPage.updateServicesPageHero({
      ...hero,
      ...this.servicesHeroForm,
    });

    if (error) {
      this.toast.error();
    } else {
      this.toast.success('Hero section saved.');
    }
  }

  protected setupMethodologyForm(): void {
    const meth = this.servicesMethodology();
    if (meth) {
      this.servicesMethodologyForm = {
        section_label: meth.section_label ?? '',
        headline: meth.headline ?? '',
        subtext: meth.subtext ?? '',
      };
    }
  }

  protected async saveServicesMethodology(): Promise<void> {
    const meth = this.servicesMethodology();
    if (!meth) return;

    const { error } = await this.servicesPage.updateServicesMethodology({
      ...meth,
      ...this.servicesMethodologyForm,
    });

    if (error) {
      this.toast.error();
    } else {
      this.toast.success('Methodology section saved.');
    }
  }

  protected async saveMethodologyStep(step: { id: string; step_number: number; title: string; description: string }): Promise<void> {
    const { error } = await this.servicesPage.updateMethodologyStep(step.id, {
      step_number: step.step_number,
      title: step.title,
      description: step.description,
    });

    if (error) {
      this.toast.error();
    } else {
      this.toast.success('Methodology step saved.');
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
    }
  }

  protected cancelEditServicesImage(): void {
    this.editingServicesImageKey.set(null);
    this.servicesImageForm = { key: '', url: '', alt_text: '' };
  }

  protected async saveServicesImage(): Promise<void> {
    const { error } = await this.servicesPage.upsertServicesImage(
      this.servicesImageForm.key,
      this.servicesImageForm.url,
      this.servicesImageForm.alt_text,
    );

    if (error) {
      this.toast.error();
    } else {
      this.toast.success('Image saved.');
      this.cancelEditServicesImage();
    }
  }
}