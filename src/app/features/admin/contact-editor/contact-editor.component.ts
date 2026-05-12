import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CompanyFacade } from '../../../core/company.facade';
import { ContactFacade } from '../../../core/contact.facade';
import { ToastService } from '../../../shared/toast/toast.service';

@Component({
  selector: 'app-contact-editor',
  imports: [FormsModule],
  templateUrl: './contact-editor.component.html',
  styleUrl: './contact-editor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactEditorComponent implements OnInit {
  readonly contact = inject(ContactFacade);
  readonly company = inject(CompanyFacade);
  readonly toast = inject(ToastService);

  // Forms
  contactHeroForm = { label: '', headline: '', body: '' };
  contactFormContentForm = {
    form_title: '',
    success_title: '',
    success_body: '',
    error_message: '',
    footer_note: '',
    submit_label: '',
    loading_label: '',
  };
  formLabelsForm = {
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
  };

  ngOnInit(): void {
    this.contact.fetchContactContent();
  }

  async saveContactHero(): Promise<void> {
    const hero = this.contact.contactPageHero();
    if (!hero) return;
    const { error } = await this.contact.updateContactPageHero({
      ...hero,
      ...this.contactHeroForm,
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
      ...this.contactFormContentForm,
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
      ...this.formLabelsForm,
    });
    if (error) {
      this.toast.error();
    } else {
      this.toast.success('Libellés du formulaire enregistrés.');
    }
  }
}