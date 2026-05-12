import { ChangeDetectionStrategy, Component, computed, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CompanyFacade } from '../../core/company.facade';
import { ContactFacade } from '../../core/contact.facade';
import { QuoteRequest, SupabaseService } from '../../core/supabase.service';
import { ToastService } from '../../shared/toast/toast.service';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Contact implements OnInit {
  private readonly fb = inject(FormBuilder);
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

  readonly quoteForm = this.fb.group({
    fullName: ['', Validators.required],
    phone: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    desiredDate: [''],
    projectType: [this.firstProjectType()],
    description: ['', Validators.required],
  });

  private readonly submitted = signal(false);
  readonly submitStatus = signal<'idle' | 'loading' | 'success' | 'error'>('idle');

  readonly showErrors = computed(() => this.submitted() && this.quoteForm.invalid);

  ngOnInit(): void {
    this.company.fetchCompanyInfo();
    this.contact.fetchContactContent();
    this.quoteForm.get('projectType')?.setValue(this.firstProjectType());
  }

  isInvalid(field: string): boolean {
    return this.submitted() && (this.quoteForm.get(field)?.invalid ?? false);
  }

  async onSubmit(): Promise<void> {
    this.submitted.set(true);

    if (this.quoteForm.invalid) return;

    this.submitStatus.set('loading');

    const v = this.quoteForm.value;
    const payload: QuoteRequest = {
      full_name: v.fullName ?? '',
      phone: v.phone ?? '',
      email: v.email ?? '',
      desired_date: v.desiredDate || null,
      project_type: v.projectType ?? '',
      description: v.description ?? '',
    };

    const { error } = await this.supabase.insertQuoteRequest(payload);

    if (error) {
      this.submitStatus.set('idle');
      this.toast.error();
    } else {
      this.submitStatus.set('success');
      this.toast.success("Votre demande a bien été envoyée. Je vous répondrai sous 48h.");
      this.quoteForm.reset({ projectType: this.firstProjectType() });
      this.submitted.set(false);
    }
  }
}