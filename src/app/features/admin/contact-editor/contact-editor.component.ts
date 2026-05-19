import { ChangeDetectionStrategy, Component, effect, inject, OnInit, signal } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { CompanyFacade } from '../../../core/company.facade';
import { ContactFacade } from '../../../core/contact.facade';
import { ToastService } from '../../../shared/toast/toast.service';
import { LoaderComponent } from '../../../shared/loader/loader.component';
import { SectionCardComponent } from '../../../shared/section-card/section-card.component';
import { FormFieldComponent } from '../../../shared/form-field/form-field.component';

@Component({
  selector: 'app-contact-editor',
  imports: [FormField, LoaderComponent, SectionCardComponent, FormFieldComponent],
  templateUrl: './contact-editor.component.html',
  styleUrl: './contact-editor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactEditorComponent implements OnInit {
  readonly contact = inject(ContactFacade);
  readonly company = inject(CompanyFacade);
  readonly toast = inject(ToastService);

  // Loading states
  readonly savingContactHero = signal(false);
  readonly savingContactStat = signal(false);
  readonly savingProjectType = signal(false);
  readonly savingContactFormContent = signal(false);
  readonly savingFormLabels = signal(false);

  // Forms
  private contactHeroModel = signal({
    label: '',
    headline: '',
    body: '',
  });
  readonly contactHeroForm = form(this.contactHeroModel);

  private contactFormContentModel = signal({
    form_title: '',
    success_title: '',
    success_body: '',
    error_message: '',
    footer_note: '',
    submit_label: '',
    loading_label: '',
  });
  readonly contactFormContentForm = form(this.contactFormContentModel);

  private formLabelsModel = signal({
    full_name_label: '',
    full_name_error: '',
    full_name_placeholder: '',
    phone_label: '',
    phone_error: '',
    phone_placeholder: '',
    email_label: '',
    email_error: '',
    email_placeholder: '',
    desired_date_label: '',
    desired_date_placeholder: '',
    project_type_label: '',
    description_label: '',
    description_error: '',
    description_placeholder: '',
  });
  readonly formLabelsForm = form(this.formLabelsModel);

  ngOnInit(): void {
    this.contact.fetchContactContent();
    effect(() => {
      const hero = this.contact.contactPageHero();
      if (hero) {
        this.syncContactHero();
      }
    });
    effect(() => {
      const content = this.contact.contactFormContent();
      if (content) {
        this.syncContactFormContent();
      }
    });
    effect(() => {
      const labels = this.contact.formLabels();
      if (labels) {
        this.syncFormLabels();
      }
    });
  }

  private syncContactHero(): void {
    const hero = this.contact.contactPageHero();
    if (hero) {
      this.contactHeroModel.set({
        label: hero.label ?? '',
        headline: hero.headline ?? '',
        body: hero.body ?? '',
      });
    }
  }

  private syncContactFormContent(): void {
    const content = this.contact.contactFormContent();
    if (content) {
      this.contactFormContentModel.set({
        form_title: content.form_title ?? '',
        success_title: content.success_title ?? '',
        success_body: content.success_body ?? '',
        error_message: content.error_message ?? '',
        footer_note: content.footer_note ?? '',
        submit_label: content.submit_label ?? '',
        loading_label: content.loading_label ?? '',
      });
    }
  }

  private syncFormLabels(): void {
    const labels = this.contact.formLabels();
    if (labels) {
      this.formLabelsModel.set({
        full_name_label: labels.full_name_label ?? '',
        full_name_error: labels.full_name_error ?? '',
        full_name_placeholder: labels.full_name_placeholder ?? '',
        phone_label: labels.phone_label ?? '',
        phone_error: labels.phone_error ?? '',
        phone_placeholder: labels.phone_placeholder ?? '',
        email_label: labels.email_label ?? '',
        email_error: labels.email_error ?? '',
        email_placeholder: labels.email_placeholder ?? '',
        desired_date_label: labels.desired_date_label ?? '',
        desired_date_placeholder: labels.desired_date_placeholder ?? '',
        project_type_label: labels.project_type_label ?? '',
        description_label: labels.description_label ?? '',
        description_error: labels.description_error ?? '',
        description_placeholder: labels.description_placeholder ?? '',
      });
    }
  }

  async saveContactHero(): Promise<void> {
    const hero = this.contact.contactPageHero();
    if (!hero) return;
    this.savingContactHero.set(true);
    try {
      const { error } = await this.contact.updateContactPageHero({
        ...hero,
        ...this.contactHeroModel(),
      });
      if (error) {
        this.toast.error('Erreur lors de la mise a jour de l\'en-tete contact');
      } else {
        this.toast.success('En-tête contact enregistré.');
      }
    } finally {
      this.savingContactHero.set(false);
    }
  }

  async saveContactStat(stat: { id: string; value: string; label: string }): Promise<void> {
    this.savingContactStat.set(true);
    try {
      const { error } = await this.contact.updateContactStat(stat.id, { value: stat.value, label: stat.label });
      if (error) {
        this.toast.error('Erreur lors de la mise a jour de la statistique');
      } else {
        this.toast.success('Statistique enregistrée.');
      }
    } finally {
      this.savingContactStat.set(false);
    }
  }

  async saveProjectType(pt: { id: string; label: string }): Promise<void> {
    this.savingProjectType.set(true);
    try {
      const { error } = await this.contact.updateProjectType(pt.id, pt.label);
      if (error) {
        this.toast.error('Erreur lors de la mise a jour du type de projet');
      } else {
        this.toast.success('Type de projet enregistré.');
      }
    } finally {
      this.savingProjectType.set(false);
    }
  }

  async saveContactFormContent(): Promise<void> {
    const content = this.contact.contactFormContent();
    if (!content) return;
    this.savingContactFormContent.set(true);
    try {
      const { error } = await this.contact.updateContactFormContent({
        ...content,
        ...this.contactFormContentModel(),
      });
      if (error) {
        this.toast.error('Erreur lors de la mise a jour du contenu du formulaire');
      } else {
        this.toast.success('Contenu du formulaire enregistré.');
      }
    } finally {
      this.savingContactFormContent.set(false);
    }
  }

  async saveFormLabels(): Promise<void> {
    const labels = this.contact.formLabels();
    if (!labels) return;
    this.savingFormLabels.set(true);
    try {
      const { error } = await this.contact.updateFormLabels({
        ...labels,
        ...this.formLabelsModel(),
      });
      if (error) {
        this.toast.error('Erreur lors de la mise a jour des libelles du formulaire');
      } else {
        this.toast.success('Libellés du formulaire enregistrés.');
      }
    } finally {
      this.savingFormLabels.set(false);
    }
  }
}