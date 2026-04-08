import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { COMPANY, CompanyConfig } from '../../core/company.config';
import { QuoteRequest, SupabaseService } from '../../core/supabase.service';
import { ToastService } from '../../shared/toast/toast.service';

interface ContactStat {
  value: string;
  label: string;
}

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Contact {
  private readonly fb = inject(FormBuilder);
  private readonly supabase = inject(SupabaseService);
  private readonly toast = inject(ToastService);

  readonly company: CompanyConfig = COMPANY;

  readonly contactStats: ContactStat[] = [
    { value: '150+', label: 'Systèmes déployés' },
    { value: '24/7', label: 'Support technique' },
  ];

  readonly projectTypes: string[] = [
    'Automatisme Industriel',
    'Robotique & Cobotique',
    'Vision Artificielle',
    'Supervision SCADA',
    'Maintenance & Audit',
  ];

  readonly quoteForm = this.fb.group({
    fullName: ['', Validators.required],
    phone: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    desiredDate: [''],
    projectType: [this.projectTypes[0]],
    description: ['', Validators.required],
  });

  private readonly submitted = signal(false);
  readonly submitStatus = signal<'idle' | 'loading' | 'success' | 'error'>('idle');

  readonly showErrors = computed(() => this.submitted() && this.quoteForm.invalid);

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
      this.toast.success('Votre demande a bien été envoyée. Nous vous contacterons bientôt.');
      this.quoteForm.reset({ projectType: this.projectTypes[0] });
      this.submitted.set(false);
    }
  }
}
