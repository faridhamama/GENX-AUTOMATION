import { inject, Injectable, signal } from '@angular/core';
import type {
  ContactPageHeroRow,
  ContactStatRow,
  ProjectTypeRow,
  ContactFormContentRow,
  FormLabelsRow,
} from './models/index';
import { ContactDbService } from './services/contact-db.service';

@Injectable({ providedIn: 'root' })
export class ContactFacade {
  private readonly db = inject(ContactDbService);

  readonly contactPageHero = signal<ContactPageHeroRow | null>(null);
  readonly contactStats = signal<ContactStatRow[]>([]);
  readonly projectTypes = signal<ProjectTypeRow[]>([]);
  readonly contactFormContent = signal<ContactFormContentRow | null>(null);
  readonly formLabels = signal<FormLabelsRow | null>(null);
  readonly contactLoading = signal(false);

  async fetchContactContent(): Promise<void> {
    this.contactLoading.set(true);
    await Promise.all([
      this.fetchContactPageHero(),
      this.fetchContactStats(),
      this.fetchProjectTypes(),
      this.fetchContactFormContent(),
      this.fetchFormLabels(),
    ]);
    this.contactLoading.set(false);
  }

  private async fetchContactPageHero(): Promise<void> {
    const { data, error } = await this.db.getContactPageHero();
    if (!error && data) this.contactPageHero.set(data);
  }

  private async fetchContactStats(): Promise<void> {
    const { data, error } = await this.db.getContactStats();
    if (!error && data) this.contactStats.set(data);
  }

  private async fetchProjectTypes(): Promise<void> {
    const { data, error } = await this.db.getProjectTypes();
    if (!error && data) this.projectTypes.set(data);
  }

  private async fetchContactFormContent(): Promise<void> {
    const { data, error } = await this.db.getContactFormContent();
    if (!error && data) this.contactFormContent.set(data);
  }

  private async fetchFormLabels(): Promise<void> {
    const { data, error } = await this.db.getFormLabels();
    if (!error && data) this.formLabels.set(data);
  }

  async updateContactPageHero(hero: ContactPageHeroRow): Promise<{ error: string | null }> {
    const { error } = await this.db.upsertContactPageHero(hero);
    if (!error) await this.fetchContactPageHero();
    return { error };
  }

  async updateContactStat(id: string, stat: Partial<ContactStatRow>): Promise<{ error: string | null }> {
    const { error } = await this.db.upsertContactStat({ ...stat, id });
    if (!error) await this.fetchContactStats();
    return { error };
  }

  async updateProjectType(id: string, label: string): Promise<{ error: string | null }> {
    const { error } = await this.db.upsertProjectType(id, label);
    if (!error) await this.fetchProjectTypes();
    return { error };
  }

  async updateContactFormContent(content: ContactFormContentRow): Promise<{ error: string | null }> {
    const { error } = await this.db.upsertContactFormContent(content);
    if (!error) await this.fetchContactFormContent();
    return { error };
  }

  async restore(): Promise<void> {
    await Promise.all([
      this.fetchContactPageHero(),
      this.fetchContactStats(),
      this.fetchProjectTypes(),
      this.fetchContactFormContent(),
      this.fetchFormLabels(),
    ]);
  }

  async updateFormLabels(labels: FormLabelsRow): Promise<{ error: string | null }> {
    const { error } = await this.db.upsertFormLabels(labels);
    if (!error) await this.fetchFormLabels();
    return { error };
  }
}