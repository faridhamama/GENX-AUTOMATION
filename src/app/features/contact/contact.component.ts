import { ChangeDetectionStrategy, Component, computed, inject, signal, OnInit } from '@angular/core';
import { FormField, form, required, email, submit } from '@angular/forms/signals';
import { LoaderComponent } from '../../shared/loader/loader.component';
import { CompanyFacade } from '../../core/company.facade';
import { ContactFacade } from '../../core/contact.facade';
import type { QuoteRequest } from '../../core/models/index';
import { SupabaseService } from '../../core/services/supabase.service';
import { ToastService } from '../../shared/toast/toast.service';

@Component({
  selector: 'app-contact',
  imports: [FormField, LoaderComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent implements OnInit {
  private readonly supabase = inject(SupabaseService);
  private readonly toast = inject(ToastService);
  private readonly company = inject(CompanyFacade);
  private readonly contact = inject(ContactFacade);

  readonly companyInfoData = this.company.companyInfo;

  // CMS-driven content
  readonly heroLabel = computed(() => this.contact.contactPageHero()?.label ?? 'Ingénierie de précision');
  readonly heroHeadline = computed(() => this.contact.contactPageHero()?.headline ?? 'Parlons de votre projet');
  readonly heroBody = computed(() => this.contact.contactPageHero()?.body ?? "J'analyse vos besoins industriels pour concevoir des solutions d'automatisation sur mesure.");

  readonly contactStats = computed(() => this.contact.contactStats());
  readonly projectTypesList = computed(() => this.contact.projectTypes());

  readonly formTitle = computed(() => this.contact.contactFormContent()?.form_title ?? 'Demander un Devis');
  readonly successTitle = computed(() => this.contact.contactFormContent()?.success_title ?? 'Demande envoyée !');
  readonly successBody = computed(() => this.contact.contactFormContent()?.success_body ?? 'Je vous répondrai sous 48h ouvrées.');
  readonly errorMessage = computed(() => this.contact.contactFormContent()?.error_message ?? 'Veuillez remplir tous les champs obligatoires correctement.');
  readonly footerNote = computed(() => this.contact.contactFormContent()?.footer_note ?? 'Réponse technique garantie sous 48h ouvrées');
  readonly submitLabel = computed(() => this.contact.contactFormContent()?.submit_label ?? 'Envoyer ma demande');
  readonly loadingLabel = computed(() => this.contact.contactFormContent()?.loading_label ?? 'Envoi en cours…');

  readonly labels = computed(() => this.contact.formLabels());

  readonly firstProjectType = computed(() => this.projectTypesList()[0]?.label ?? 'Automatisation industrielle');

  // Form Model - Signal Form with validation
  private contactModel = signal({
    fullName: '',
    phone: '',
    email: '',
    desiredDate: '',
    projectType: '',
    description: '',
  });

  readonly quoteForm = form(this.contactModel, (s) => {
    required(s.fullName, { message: 'Le nom est requis' });
    required(s.phone, { message: 'Le téléphone est requis' });
    required(s.email, { message: 'L\'email est requis' });
    email(s.email, { message: 'Email invalide' });
    required(s.description, { message: 'La description est requise' });
  });

  readonly submitStatus = signal<'idle' | 'loading' | 'success' | 'error'>('idle');

  async ngOnInit(): Promise<void> {
    this.company.fetchCompanyInfo();
    await this.contact.fetchContactContent();
    // Set default project type after data is loaded
    const firstType = this.firstProjectType();
    if (firstType) {
      this.contactModel.update(m => ({ ...m, projectType: firstType }));
    }
  }

  async onSubmit(): Promise<void> {
    submit(this.quoteForm, async () => {
      this.submitStatus.set('loading');

      const v = this.contactModel();
      const payload: QuoteRequest = {
        full_name: v.fullName,
        phone: v.phone,
        email: v.email,
        desired_date: v.desiredDate || null,
        project_type: v.projectType,
        description: v.description,
      };

      const { error } = await this.supabase.insertQuoteRequest(payload);

      if (error) {
        this.submitStatus.set('error');
        this.toast.error();
      } else {
        this.submitStatus.set('success');
        this.toast.success("Votre demande a bien été envoyée. Je vous répondrai sous 48h.");
        this.contactModel.set({
          fullName: '',
          phone: '',
          email: '',
          desiredDate: '',
          projectType: this.firstProjectType(),
          description: '',
        });
      }
    });
  }
}