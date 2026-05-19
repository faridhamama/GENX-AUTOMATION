import { ChangeDetectionStrategy, Component, effect, inject, OnInit, signal } from '@angular/core';
import { FormField, form } from '@angular/forms/signals';
import { FormsModule } from '@angular/forms';
import { CompanyFacade } from '../../../core/company.facade';
import { ToastService } from '../../../shared/toast/toast.service';
import { LoaderComponent } from '../../../shared/loader/loader.component';
import { EmptyStateComponent } from '../../../shared/empty-state/empty-state.component';
import { SaveCancelGroupComponent } from '../../../shared/save-cancel-group/save-cancel-group.component';
import { IconSelectComponent } from '../../../shared/icon-select/icon-select.component';
import { SectionCardComponent } from '../../../shared/section-card/section-card.component';
import { FormFieldComponent } from '../../../shared/form-field/form-field.component';

@Component({
  selector: 'app-company-editor',
  imports: [
    FormField,
    FormsModule,
    LoaderComponent,
    EmptyStateComponent,
    SaveCancelGroupComponent,
    IconSelectComponent,
    SectionCardComponent,
    FormFieldComponent,
  ],
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

  // Loading states
  readonly savingCompanyInfo = signal(false);
  readonly savingService = signal(false);
  readonly savingValue = signal(false);

  // Company Info Form - Signal Form
  private companyInfoModel = signal({
    contact_email: '',
    contact_phone: '',
    contact_address: '',
    availability_hours: '',
    availability_days: '',
  });
  readonly companyInfoForm = form(this.companyInfoModel);

  readonly serviceForm = signal({ label: '', description: '' });
  readonly valueForm = signal({ icon: '', title: '', description: '' });

  ngOnInit(): void {
    this.company.fetchCompanyInfo();
    this.company.fetchServices();
    this.company.fetchCompanyValues();
    effect(() => {
      const info = this.companyInfoData();
      if (info) {
        this.syncCompanyInfoForm();
      }
    });
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
    this.savingCompanyInfo.set(true);
    try {
      const { error } = await this.company.updateCompanyInfo(this.companyInfoModel());
      if (error) {
        this.toast.error('Erreur lors de la sauvegarde');
      } else {
        this.toast.success('Modifications enregistrées');
      }
    } finally {
      this.savingCompanyInfo.set(false);
    }
  }

  showAddServiceForm(): void {
    this.serviceForm.set({ label: '', description: '' });
    this.showAddService.set(true);
  }

  startEditService(id: string): void {
    const service = this.services().find((s) => s.id === id);
    if (!service) return;
    this.serviceForm.set({ label: service.label, description: service.description });
    this.editingServiceId.set(id);
  }

  cancelEditService(): void {
    this.editingServiceId.set(null);
    this.showAddService.set(false);
    this.serviceForm.set({ label: '', description: '' });
  }

  async saveService(): Promise<void> {
    const { label, description } = this.serviceForm();
    const trimmedLabel = label.trim();
    if (!trimmedLabel) return;

    this.savingService.set(true);
    try {
      const editingId = this.editingServiceId();
      if (editingId) {
        const { error } = await this.company.updateService(editingId, trimmedLabel, description.trim());
        if (error) {
          this.toast.error('Erreur lors de la mise a jour du service');
          return;
        }
        this.toast.success('Service mis à jour');
      } else {
        const { error } = await this.company.createService(trimmedLabel, description.trim());
        if (error) {
          this.toast.error('Erreur lors de la creation du service');
          return;
        }
        this.toast.success('Service ajouté');
      }
      this.cancelEditService();
    } finally {
      this.savingService.set(false);
    }
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
    this.valueForm.set({ icon: value.icon, title: value.title, description: value.description });
    this.editingValueId.set(id);
  }

  cancelEditValue(): void {
    this.editingValueId.set(null);
    this.valueForm.set({ icon: '', title: '', description: '' });
  }

  async saveValue(): Promise<void> {
    const id = this.editingValueId();
    if (!id) return;
    const { icon, title, description } = this.valueForm();
    const trimmedIcon = icon.trim();
    const trimmedTitle = title.trim();
    if (!trimmedIcon || !trimmedTitle) return;

    this.savingValue.set(true);
    try {
      const { error } = await this.company.updateCompanyValue(id, trimmedIcon, trimmedTitle, description.trim());
      if (error) {
        this.toast.error('Erreur lors de la sauvegarde');
        return;
      }
      this.toast.success('Valeur mise à jour');
      this.cancelEditValue();
    } finally {
      this.savingValue.set(false);
    }
  }

  onIconChange(icon: string): void {
    this.valueForm.update(f => ({ ...f, icon }));
  }
}