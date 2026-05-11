import { NgForm } from '@angular/forms';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CompanyInfoService } from '../../../core/company-info.service';
import { ToastService } from '../../../shared/toast/toast.service';

@Component({
  selector: 'app-admin-contact',
  imports: [FormsModule],
  templateUrl: './contact-admin.html',
  styleUrl: './contact-admin.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminContact implements OnInit {
  private readonly companyInfoService = inject(CompanyInfoService);
  private readonly toast = inject(ToastService);

  readonly companyInfo = this.companyInfoService.companyInfo;

  ngOnInit(): void {
    this.companyInfoService.fetchCompanyInfo();
  }

  async saveContactInfo(form: NgForm): Promise<void> {
    const { error } = await this.companyInfoService.updateCompanyInfo(form.value);
    if (error) {
      this.toast.error('Erreur lors de la sauvegarde');
    } else {
      this.toast.success('Modifications enregistrées');
    }
  }
}