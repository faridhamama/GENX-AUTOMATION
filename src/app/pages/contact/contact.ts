import { ChangeDetectionStrategy, Component, computed, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CompanyInfoService } from '../../core/company-info.service';
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
  private readonly companyInfo = inject(CompanyInfoService);

  readonly companyInfoData = this.companyInfo.companyInfo;

  // CMS-driven content
  readonly heroLabel = computed(() => this.companyInfo.contactPageHero()?.label ?? 'Ingénierie de précision');
  readonly heroHeadline = computed(() => this.companyInfo.contactPageHero()?.headline ?? 'Parlons de votre projet');
  readonly heroBody = computed(() => this.companyInfo.contactPageHero()?.body ?? "J'analyse vos besoins industriels pour concevoir des solutions d'automatisation sur mesure.");

  readonly contactStats = computed(() => this.companyInfo.contactStats());
  readonly projectTypesList = computed(() => this.companyInfo.projectTypes());

  readonly formTitle = computed(() => this.companyInfo.contactFormContent()?.form_title ?? 'Demander un Devis');
  readonly successTitle = computed(() => this.companyInfo.contactFormContent()?.success_title ?? 'Demande envoyée !');
  readonly successBody = computed(() => this.companyInfo.contactFormContent()?.success_body ?? 'Je vous répondrai sous 48h ouvrées.');
  readonly errorMessage = computed(() => this.companyInfo.contactFormContent()?.error_message ?? 'Veuillez remplir tous les champs obligatoires correctement.');
  readonly footerNote = computed(() => this.companyInfo.contactFormContent()?.footer_note ?? 'Réponse technique garantie sous 48h ouvrées');
  readonly submitLabel = computed(() => this.companyInfo.contactFormContent()?.submit_label ?? 'Envoyer ma demande');
  readonly loadingLabel = computed(() => this.companyInfo.contactFormContent()?.loading_label ?? 'Envoi en cours…');

  readonly labels = computed(() => this.companyInfo.formLabels());

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
    this.companyInfo.fetchCompanyInfo();
    this.companyInfo.fetchContactContent();
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
