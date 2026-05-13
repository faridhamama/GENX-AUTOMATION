import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { CompanyFacade } from '../../../core/company.facade';
import { ContactFacade } from '../../../core/contact.facade';
import { ToastService } from '../../../shared/toast/toast.service';
import { LoaderComponent } from '../../../shared/loader/loader.component';

@Component({
  selector: 'app-contact-editor',
  imports: [FormField, LoaderComponent],
  templateUrl: './contact-editor.component.html',
  styleUrl: './contact-editor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactEditorComponent implements OnInit {
  readonly contact = inject(ContactFacade);
  readonly company = inject(CompanyFacade);
  readonly toast = inject(ToastService);

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
    // Sync forms once data is loaded
    setTimeout(() => {
      this.syncContactHero();
      this.syncContactFormContent();
      this.syncFormLabels();
    }, 300);
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
    const { error } = await this.contact.updateContactPageHero({
      ...hero,
      ...this.contactHeroModel(),
    });
    if (error) {
      this.toast.error();
    } else {
      this.toast.success('En-tête contact enregistré.');
    }
  }

  async saveContactStat(stat: { id: string; value: string; label: string }): Promise<void> {
    const { error } = await this.contact.updateContactStat(stat.id, { value: stat.value, label: stat.label });
    if (error) {
      this.toast.error();
    } else {
      this.toast.success('Statistique enregistrée.');
    }
  }

  async saveProjectType(pt: { id: string; label: string }): Promise<void> {
    const { error } = await this.contact.updateProjectType(pt.id, pt.label);
    if (error) {
      this.toast.error();
    } else {
      this.toast.success('Type de projet enregistré.');
    }
  }

  async saveContactFormContent(): Promise<void> {
    const content = this.contact.contactFormContent();
    if (!content) return;
    const { error } = await this.contact.updateContactFormContent({
      ...content,
      ...this.contactFormContentModel(),
    });
    if (error) {
      this.toast.error();
    } else {
      this.toast.success('Contenu du formulaire enregistré.');
    }
  }

  async saveFormLabels(): Promise<void> {
    const labels = this.contact.formLabels();
    if (!labels) return;
    const { error } = await this.contact.updateFormLabels({
      ...labels,
      ...this.formLabelsModel(),
    });
    if (error) {
      this.toast.error();
    } else {
      this.toast.success('Libellés du formulaire enregistrés.');
    }
  }
}