import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { FormsModule } from '@angular/forms';
import { CompanyFacade } from '../../../core/company.facade';
import { ToastService } from '../../../shared/toast/toast.service';
import { LoaderComponent } from '../../../shared/loader/loader.component';

@Component({
  selector: 'app-company-editor',
  imports: [FormField, FormsModule, LoaderComponent],
  templateUrl: './company-editor.component.html',
  styleUrl: './company-editor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanyEditorComponent implements OnInit {
  private readonly company = inject(CompanyFacade);
  private readonly toast = inject(ToastService);

  readonly services = this.company.services;
  readonly companyValues = this.company.companyValues;
  readonly companyInfoData = this.company.companyInfo;

  readonly editingServiceId = signal<string | null>(null);
  readonly showAddService = signal(false);
  readonly editingValueId = signal<string | null>(null);

  // Company Info Form - Signal Form
  private companyInfoModel = signal({
    contact_email: '',
    contact_phone: '',
    contact_address: '',
    availability_hours: '',
    availability_days: '',
  });
  readonly companyInfoForm = form(this.companyInfoModel);

  readonly serviceForm = { label: '', description: '' };
  readonly valueForm = { icon: '', title: '', description: '' };

  readonly availableIcons = [
    'engineering',
    'handshake',
    'workspace_premium',
    'precision_manufacturing',
    'monitoring',
    'support_agent',
    'verified',
    'security',
  ];

  ngOnInit(): void {
    this.company.fetchCompanyInfo();
    this.company.fetchServices();
    this.company.fetchCompanyValues();
    // Sync company info form once data is available
    setTimeout(() => {
      this.syncCompanyInfoForm();
    }, 500);
  }

  syncCompanyInfoForm(): void {
    const info = this.companyInfoData();
    if (info) {
      this.companyInfoModel.set({
        contact_email: info.contact_email ?? '',
        contact_phone: info.contact_phone ?? '',
        contact_address: info.contact_address ?? '',
        availability_hours: info.availability_hours ?? '',
        availability_days: info.availability_days ?? '',
      });
    }
  }

  async saveCompanyInfo(): Promise<void> {
    const { error } = await this.company.updateCompanyInfo(this.companyInfoModel());
    if (error) {
      this.toast.error('Erreur lors de la sauvegarde');
    } else {
      this.toast.success('Modifications enregistrées');
    }
  }

  showAddServiceForm(): void {
    this.serviceForm.label = '';
    this.serviceForm.description = '';
    this.showAddService.set(true);
  }

  startEditService(id: string): void {
    const service = this.services().find((s) => s.id === id);
    if (!service) return;
    this.serviceForm.label = service.label;
    this.serviceForm.description = service.description;
    this.editingServiceId.set(id);
  }

  cancelEditService(): void {
    this.editingServiceId.set(null);
    this.showAddService.set(false);
    this.serviceForm.label = '';
    this.serviceForm.description = '';
  }

  async saveService(): Promise<void> {
    const label = this.serviceForm.label.trim();
    const description = this.serviceForm.description.trim();
    if (!label) return;

    const editingId = this.editingServiceId();
    if (editingId) {
      const { error } = await this.company.updateService(editingId, label, description);
      if (error) {
        this.toast.error();
        return;
      }
      this.toast.success('Service mis à jour');
    } else {
      const { error } = await this.company.createService(label, description);
      if (error) {
        this.toast.error();
        return;
      }
      this.toast.success('Service ajouté');
    }
    this.cancelEditService();
  }

  async deleteService(id: string): Promise<void> {
    if (!confirm('Supprimer ce service définitivement ? Cette action est irréversible.')) return;
    const { error } = await this.company.deleteService(id);
    if (error) {
      this.toast.error('Erreur lors de la suppression');
      return;
    }
    this.toast.success('Service supprimé');
    if (this.editingServiceId() === id) this.cancelEditService();
  }

  async moveService(id: string, direction: 'up' | 'down'): Promise<void> {
    const list = this.services();
    const index = list.findIndex((s) => s.id === id);
    if (index < 0) return;
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= list.length) return;
    const { error } = await this.company.swapServiceOrder(id, list[target].id);
    if (error) this.toast.error('Erreur lors du déplacement');
  }

  startEditValue(id: string): void {
    const value = this.companyValues().find((v) => v.id === id);
    if (!value) return;
    this.valueForm.icon = value.icon;
    this.valueForm.title = value.title;
    this.valueForm.description = value.description;
    this.editingValueId.set(id);
  }

  cancelEditValue(): void {
    this.editingValueId.set(null);
    this.valueForm.icon = '';
    this.valueForm.title = '';
    this.valueForm.description = '';
  }

  async saveValue(): Promise<void> {
    const id = this.editingValueId();
    if (!id) return;
    const icon = this.valueForm.icon.trim();
    const title = this.valueForm.title.trim();
    const description = this.valueForm.description.trim();
    if (!icon || !title) return;

    const { error } = await this.company.updateCompanyValue(id, icon, title, description);
    if (error) {
      this.toast.error('Erreur lors de la sauvegarde');
      return;
    }
    this.toast.success('Valeur mise à jour');
    this.cancelEditValue();
  }
}