import { inject, Injectable, signal } from '@angular/core';
import type { CompanyInfo, Service, CompanyValue } from './models/index';
import { CompanyDbService } from './services/company-db.service';

@Injectable({ providedIn: 'root' })
export class CompanyFacade {
  private readonly db = inject(CompanyDbService);

  readonly companyInfo = signal<CompanyInfo | null>(null);
  readonly isLoading = signal(false);

  readonly services = signal<Service[]>([]);
  readonly servicesLoading = signal(false);

  readonly companyValues = signal<CompanyValue[]>([]);
  readonly valuesLoading = signal(false);

  async fetchCompanyInfo(): Promise<void> {
    this.isLoading.set(true);
    const { data, error } = await this.db.getCompanyInfo();
    if (!error && data) this.companyInfo.set(data);
    this.isLoading.set(false);
  }

  async updateCompanyInfo(info: Partial<CompanyInfo>): Promise<{ error: string | null }> {
    const { error } = await this.db.updateCompanyInfo(info);
    if (!error) await this.fetchCompanyInfo();
    return { error };
  }

  async fetchServices(): Promise<void> {
    this.servicesLoading.set(true);
    const { data, error } = await this.db.getServices();
    if (!error && data) this.services.set(data);
    this.servicesLoading.set(false);
  }

  async createService(label: string, description: string): Promise<{ error: string | null }> {
    const maxOrder = this.services().reduce((max, s) => Math.max(max, s.sort_order), 0);
    const { error } = await this.db.createService(label, description, maxOrder + 1);
    if (!error) await this.fetchServices();
    return { error };
  }

  async updateService(id: string, label: string, description: string): Promise<{ error: string | null }> {
    const { error } = await this.db.updateService(id, label, description);
    if (!error) await this.fetchServices();
    return { error };
  }

  async deleteService(id: string): Promise<{ error: string | null }> {
    const { error } = await this.db.deleteService(id);
    if (!error) await this.fetchServices();
    return { error };
  }

  async swapServiceOrder(id1: string, id2: string): Promise<{ error: string | null }> {
    const { error } = await this.db.swapServiceOrder(id1, id2);
    if (!error) await this.fetchServices();
    return { error };
  }

  async fetchCompanyValues(): Promise<void> {
    this.valuesLoading.set(true);
    const { data, error } = await this.db.getCompanyValues();
    if (!error && data) this.companyValues.set(data);
    this.valuesLoading.set(false);
  }

  async updateCompanyValue(id: string, icon: string, title: string, description: string): Promise<{ error: string | null }> {
    const { error } = await this.db.updateCompanyValue(id, { icon, title, description });
    if (!error) await this.fetchCompanyValues();
    return { error };
  }
}