import { NgForm } from '@angular/forms';
import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CompanyInfoService } from '../../../core/company-info.service';
import { ToastService } from '../../../shared/toast/toast.service';

@Component({
  selector: 'app-company-admin',
  imports: [FormsModule],
  templateUrl: './company.html',
  styleUrl: './company.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanyAdmin implements OnInit {
  private readonly companyInfoService = inject(CompanyInfoService);
  private readonly toast = inject(ToastService);

  readonly activeTab = signal<'about' | 'contact'>('about');

  // Edit states
  readonly editingServiceId = signal<string | null>(null);
  readonly editingValueId = signal<string | null>(null);
  readonly showAddService = signal(false);

  // Form models
  serviceForm = { label: '', description: '' };
  valueForm = { icon: '', title: '', description: '' };

  readonly companyInfo = this.companyInfoService.companyInfo;
  readonly services = this.companyInfoService.services;
  readonly companyValues = this.companyInfoService.companyValues;

  ngOnInit(): void {
    this.companyInfoService.fetchCompanyInfo();
    this.companyInfoService.fetchServices();
    this.companyInfoService.fetchCompanyValues();
  }

  setTab(tab: 'about' | 'contact'): void {
    this.activeTab.set(tab);
  }

  async saveCompanyInfo(form: NgForm): Promise<void> {
    const { error } = await this.companyInfoService.updateCompanyInfo(form.value);
    if (error) {
      this.toast.error('Erreur lors de la sauvegarde');
    } else {
      this.toast.success('Modifications enregistrées');
    }
  }

  startEditService(id: string): void {
    const service = this.services().find((s) => s.id === id);
    if (service) {
      this.serviceForm = { label: service.label, description: service.description };
      this.editingServiceId.set(id);
    }
  }

  cancelEditService(): void {
    this.editingServiceId.set(null);
    this.serviceForm = { label: '', description: '' };
    this.showAddService.set(false);
  }

  async saveService(): Promise<void> {
    const id = this.editingServiceId();
    if (!this.serviceForm.label.trim()) return;

    if (id) {
      const { error } = await this.companyInfoService.updateService(id, this.serviceForm.label, this.serviceForm.description);
      if (error) { this.toast.error('Erreur lors de la mise à jour'); return; }
      this.toast.success('Service mis à jour');
    } else {
      const { error } = await this.companyInfoService.createService(this.serviceForm.label, this.serviceForm.description);
      if (error) { this.toast.error('Erreur lors de l\'ajout'); return; }
      this.toast.success('Service ajouté');
    }
    this.cancelEditService();
  }

  async deleteService(id: string): Promise<void> {
    if (!confirm('Supprimer ce service ?')) return;
    const { error } = await this.companyInfoService.deleteService(id);
    if (error) { this.toast.error('Erreur lors de la suppression'); return; }
    this.toast.success('Service supprimé');
  }

  showAddServiceForm(): void {
    this.serviceForm = { label: '', description: '' };
    this.showAddService.set(true);
    this.editingServiceId.set(null);
  }

  async moveService(id: string, direction: 'up' | 'down'): Promise<void> {
    const list = this.services();
    const index = list.findIndex((s) => s.id === id);
    if (direction === 'up' && index > 0) {
      const newOrder = [list[index - 1].id, list[index].id];
      const { error } = await this.companyInfoService.reorderServices(newOrder);
      if (error) { this.toast.error('Erreur lors du réordonnancement'); return; }
    } else if (direction === 'down' && index < list.length - 1) {
      const newOrder = [list[index].id, list[index + 1].id];
      const { error } = await this.companyInfoService.reorderServices(newOrder);
      if (error) { this.toast.error('Erreur lors du réordonnancement'); return; }
    }
  }

  startEditValue(id: string): void {
    const value = this.companyValues().find((v) => v.id === id);
    if (value) {
      this.valueForm = { icon: value.icon, title: value.title, description: value.description };
      this.editingValueId.set(id);
    }
  }

  cancelEditValue(): void {
    this.editingValueId.set(null);
    this.valueForm = { icon: '', title: '', description: '' };
  }

  async saveValue(): Promise<void> {
    const id = this.editingValueId();
    if (!id || !this.valueForm.title.trim()) return;

    const { error } = await this.companyInfoService.updateCompanyValue(id, this.valueForm.icon, this.valueForm.title, this.valueForm.description);
    if (error) { this.toast.error('Erreur lors de la mise à jour'); return; }
    this.toast.success('Engagement mis à jour');
    this.cancelEditValue();
  }

  readonly availableIcons = ['engineering', 'handshake', 'workspace_premium', 'precision_manufacturing', 'support_agent', 'verified', 'security'];
}
