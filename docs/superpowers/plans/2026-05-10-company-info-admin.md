# Company Info Admin — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Admin panel to manage company info (contact + about page content) with Supabase backend. Public pages read from Supabase.

**Architecture:** Signal-based services + Supabase. Admin layout gets sidebar nav. Two-tab admin page (À propos / Contact). Public pages fetch from Supabase instead of hardcoded config.

**Tech Stack:** Angular 20, Supabase, Tailwind v4, Angular signals.

---

## File Map

| File | Responsibility |
|------|----------------|
| `src/app/core/company-info.service.ts` | New service — all company data CRUD |
| `src/app/shared/layout/admin-layout/admin-layout.ts` | Add sidebar nav with "Entreprise" section |
| `src/app/app.routes.ts` | Add `/admin/company` route as child of admin |
| `src/app/pages/admin/company/company.ts` | New component — admin company page |
| `src/app/pages/admin/company/company.html` | Template with two tabs: À propos + Contact |
| `src/app/pages/admin/company/company.scss` | Styles |
| `src/app/pages/about/about.ts` | Fetch from Supabase instead of hardcoded |
| `src/app/pages/about/about.html` | Add loading skeleton state |
| `src/app/pages/contact/contact.ts` | Fetch contact info from Supabase |
| `sql/init-company-tables.sql` | Supabase schema — run in Supabase SQL editor |
| `src/app/pages/services/services.ts` | Fetch services from Supabase |

---

## Task 1: Supabase Schema

**Files:** Create: `sql/init-company-tables.sql`

Run this in Supabase SQL Editor to create the required tables.

```sql
-- company_info: single-row key-value store
create table if not exists company_info (
  id bigint primary key default 1 check (id = 1),
  company_name text not null default 'GENX AUTOMATION',
  tagline text not null default 'Solutions complètes d''automatisme industriel, de génie électrique et de supervision au Maroc.',
  label text not null default 'Automation & Industrial Engineering',
  availability_hours text not null default '08:00 - 18:00',
  availability_days text not null default 'Lundi - Vendredi',
  contact_email text not null default '',
  contact_phone text not null default '',
  contact_address text not null default '',
  mission_quote text not null default 'Offrir aux industriels marocains des solutions d''automatisation complètes, fiables et adaptées à leurs besoins réels — de la conception à la mise en service.',
  updated_at timestamptz default now()
);

-- Insert default row if not exists
insert into company_info (id) values (1) on conflict (id) do nothing;

-- services: ordered list
create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  sort_order integer not null unique,
  label text not null,
  description text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Insert default services
insert into services (sort_order, label, description) values
  (1, 'Assistance technique & formation', 'Conseil, audits, études de faisabilité, formation du personnel technique, AMO dans l''automatisme et l''électricité industrielle'),
  (2, 'Automatisme industriel', 'Programmation et mise en service d''automates (PLC) — toute marque et technologie'),
  (3, 'Génie électrique (BT/MT)', 'Études, fourniture, installation et mise en service — tableaux électriques, armoires de puissance et de commande, postes de transformation'),
  (4, 'Instrumentation industrielle', 'Fourniture, installation, étalonnage et maintenance d''instruments de mesure, capteurs, transmetteurs, analyseurs et régulateurs'),
  (5, 'Intégration de systèmes', 'Architectures complètes, intégration de sous-systèmes, communication industrielle (Modbus, Profibus, Profinet, OPC-UA), liaison MES/ERP'),
  (6, 'Supervision (SCADA/IHM)', 'Conception, intégration et exploitation de systèmes de supervision (SCADA), interfaces homme-machine (IHM/HMI) et Topkapi, Vijeo Designer, WinCC, Ignition'),
  (7, 'Commercialisation & distribution', 'Importation et distribution de matériels, équipements, composants et logiciels relatifs à l''automatisme industriel et l''instrumentation')
on conflict do nothing;

-- company_values: exactly 3 rows
create table if not exists company_values (
  id uuid primary key default gen_random_uuid(),
  sort_order integer not null unique check (sort_order between 1 and 3),
  icon text not null default 'engineering',
  title text not null,
  description text not null,
  updated_at timestamptz default now()
);

-- Insert default values
insert into company_values (sort_order, icon, title, description) values
  (1, 'engineering', 'Rigueur industrielle', 'Une discipline forgée par des années d''expérience terrain sur des sites où la précision est une nécessité absolue'),
  (2, 'handshake', 'Transparence totale', 'Offrir ce dont le client a vraiment besoin — sans surdimensionnement ni promesses impossibles à tenir'),
  (3, 'workspace_premium', 'Savoir-faire concret', 'Du code, des schémas, des tests en situation réelle. Nous livrons ce que nous promettons')
on conflict do nothing;
```

---

## Task 2: CompanyInfoService

**Files:** Create: `src/app/core/company-info.service.ts`

```typescript
import { inject, Injectable, signal } from '@angular/core';
import { SupabaseService } from './supabase.service';

export interface CompanyInfo {
  id: number;
  company_name: string;
  tagline: string;
  label: string;
  availability_hours: string;
  availability_days: string;
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  mission_quote: string;
  updated_at: string;
}

export interface Service {
  id: string;
  sort_order: number;
  label: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface CompanyValue {
  id: string;
  sort_order: number;
  icon: string;
  title: string;
  description: string;
  updated_at: string;
}

@Injectable({ providedIn: 'root' })
export class CompanyInfoService {
  private readonly supabase = inject(SupabaseService);

  // Company info
  readonly companyInfo = signal<CompanyInfo | null>(null);
  readonly isLoading = signal(false);

  // Services
  readonly services = signal<Service[]>([]);
  readonly servicesLoading = signal(false);

  // Company values
  readonly companyValues = signal<CompanyValue[]>([]);
  readonly valuesLoading = signal(false);

  // --- Company Info ---
  async fetchCompanyInfo(): Promise<void> {
    this.isLoading.set(true);
    const { data, error } = await this.supabase.getCompanyInfo();
    if (!error && data) {
      this.companyInfo.set(data);
    }
    this.isLoading.set(false);
  }

  async updateCompanyInfo(info: Partial<CompanyInfo>): Promise<{ error: string | null }> {
    const { error } = await this.supabase.updateCompanyInfo(info);
    if (!error) {
      await this.fetchCompanyInfo();
    }
    return { error };
  }

  // --- Services ---
  async fetchServices(): Promise<void> {
    this.servicesLoading.set(true);
    const { data, error } = await this.supabase.getServices();
    if (!error && data) {
      this.services.set(data);
    }
    this.servicesLoading.set(false);
  }

  async createService(label: string, description: string): Promise<{ error: string | null }> {
    const maxOrder = this.services().reduce((max, s) => Math.max(max, s.sort_order), 0);
    const { error } = await this.supabase.createService(label, description, maxOrder + 1);
    if (!error) {
      await this.fetchServices();
    }
    return { error };
  }

  async updateService(id: string, label: string, description: string): Promise<{ error: string | null }> {
    const { error } = await this.supabase.updateService(id, label, description);
    if (!error) {
      await this.fetchServices();
    }
    return { error };
  }

  async deleteService(id: string): Promise<{ error: string | null }> {
    const { error } = await this.supabase.deleteService(id);
    if (!error) {
      await this.fetchServices();
    }
    return { error };
  }

  async reorderServices(orderedIds: string[]): Promise<{ error: string | null }> {
    const updates = orderedIds.map((id, index) =>
      this.supabase.updateServiceOrder(id, index + 1),
    );
    const results = await Promise.all(updates);
    const error = results.find((r) => r.error)?.error ?? null;
    if (!error) {
      await this.fetchServices();
    }
    return { error };
  }

  // --- Company Values ---
  async fetchCompanyValues(): Promise<void> {
    this.valuesLoading.set(true);
    const { data, error } = await this.supabase.getCompanyValues();
    if (!error && data) {
      this.companyValues.set(data);
    }
    this.valuesLoading.set(false);
  }

  async updateCompanyValue(id: string, icon: string, title: string, description: string): Promise<{ error: string | null }> {
    const { error } = await this.supabase.updateCompanyValue(id, { icon, title, description });
    if (!error) {
      await this.fetchCompanyValues();
    }
    return { error };
  }
}
```

- [ ] **Step 2: Add Supabase methods to supabase.service.ts**

Add these methods to `SupabaseService`:

```typescript
async getCompanyInfo(): Promise<{ data: CompanyInfo | null; error: string | null }> {
  const { data, error } = await this._client.from('company_info').select('*').eq('id', 1).single();
  return { data, error: error ? error.message : null };
}

async updateCompanyInfo(info: Partial<CompanyInfo>): Promise<{ error: string | null }> {
  const { error } = await this._client.from('company_info').update({ ...info, updated_at: new Date().toISOString() }).eq('id', 1);
  return { error: error ? error.message : null };
}

async getServices(): Promise<{ data: Service[]; error: string | null }> {
  const { data, error } = await this._client.from('services').select('*').order('sort_order', { ascending: true });
  return { data: (data as Service[]) ?? [], error: error ? error.message : null };
}

async createService(label: string, description: string, sortOrder: number): Promise<{ error: string | null }> {
  const { error } = await this._client.from('services').insert({ label, description, sort_order: sortOrder });
  return { error: error ? error.message : null };
}

async updateService(id: string, label: string, description: string): Promise<{ error: string | null }> {
  const { error } = await this._client.from('services').update({ label, description, updated_at: new Date().toISOString() }).eq('id', id);
  return { error: error ? error.message : null };
}

async deleteService(id: string): Promise<{ error: string | null }> {
  const { error } = await this._client.from('services').delete().eq('id', id);
  return { error: error ? error.message : null };
}

async updateServiceOrder(id: string, sortOrder: number): Promise<{ error: string | null }> {
  const { error } = await this._client.from('services').update({ sort_order: sortOrder, updated_at: new Date().toISOString() }).eq('id', id);
  return { error: error ? error.message : null };
}

async getCompanyValues(): Promise<{ data: CompanyValue[]; error: string | null }> {
  const { data, error } = await this._client.from('company_values').select('*').order('sort_order', { ascending: true });
  return { data: (data as CompanyValue[]) ?? [], error: error ? error.message : null };
}

async updateCompanyValue(id: string, data: { icon: string; title: string; description: string }): Promise<{ error: string | null }> {
  const { error } = await this._client.from('company_values').update({ ...data, updated_at: new Date().toISOString() }).eq('id', id);
  return { error: error ? error.message : null };
}
```

Also add imports for `CompanyInfo`, `Service`, `CompanyValue` at the top of supabase.service.ts.

- [ ] **Step 3: Commit**

Run: `git add src/app/core/company-info.service.ts src/app/core/supabase.service.ts sql/init-company-tables.sql && git commit -m "feat(admin): add CompanyInfoService and Supabase methods for company data"`

---

## Task 3: Admin Layout Sidebar

**Files:** Modify: `src/app/shared/layout/admin-layout/admin-layout.ts`

```typescript
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Navbar } from '../../navbar/navbar';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, Navbar, RouterLink, RouterLinkActive],
  template: `
    <app-navbar />
    <div class="flex min-h-[calc(100vh-64px)]">
      <!-- Sidebar -->
      <aside class="w-56 bg-surface border-r border-outline-variant shrink-0 hidden md:block">
        <nav class="p-4 flex flex-col gap-1">
          <a routerLink="/admin" routerLinkActive="bg-surface-container-high" class="px-3 py-2 rounded text-sm text-on-surface hover:bg-surface-container-low transition-colors">
            Tableau de bord
          </a>
          <div class="mt-4">
            <div class="px-3 py-2 font-label text-[10px] uppercase tracking-widest text-outline">Entreprise</div>
            <a routerLink="/admin/company" routerLinkActive="bg-surface-container-high" class="pl-6 pr-3 py-2 rounded text-sm text-on-surface hover:bg-surface-container-low transition-colors block">
              À propos
            </a>
            <a routerLink="/admin/company/contact" routerLinkActive="bg-surface-container-high" class="pl-6 pr-3 py-2 rounded text-sm text-on-surface hover:bg-surface-container-low transition-colors block">
              Contact
            </a>
          </div>
        </nav>
      </aside>
      <!-- Main content -->
      <main class="flex-1 p-6">
        <router-outlet />
      </main>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminLayout {}
```

- [ ] **Step 2: Commit**

Run: `git add src/app/shared/layout/admin-layout/admin-layout.ts && git commit -m "feat(admin): add sidebar nav with Entreprise section"`

---

## Task 4: Routes Update

**Files:** Modify: `src/app/app.routes.ts`

Add children to the admin route:

```typescript
{
  path: 'admin',
  loadComponent: () => import('./shared/layout/admin-layout/admin-layout').then((m) => m.AdminLayout),
  children: [
    {
      path: '',
      loadComponent: () => import('./pages/admin/dashboard/dashboard').then((m) => m.Dashboard),
    },
    {
      path: 'company',
      loadComponent: () => import('./pages/admin/company/company').then((m) => m.CompanyAdmin),
    },
  ],
},
```

- [ ] **Step 2: Commit**

Run: `git add src/app/app.routes.ts && git commit -m "feat(admin): add /admin/company route"`

---

## Task 5: Admin Company Page Component

**Files:** Create: `src/app/pages/admin/company/company.ts`

```typescript
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

  // --- Tab switching ---
  setTab(tab: 'about' | 'contact'): void {
    this.activeTab.set(tab);
  }

  // --- Company Info (Contact tab) ---
  async saveCompanyInfo(form: any): Promise<void> {
    const { error } = await this.companyInfoService.updateCompanyInfo(form);
    if (error) {
      this.toast.show('Erreur lors de la sauvegarde', 'error');
    } else {
      this.toast.show('Modifications enregistrées', 'success');
    }
  }

  // --- Services (About tab) ---
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
  }

  async saveService(): Promise<void> {
    const id = this.editingServiceId();
    if (!this.serviceForm.label.trim()) return;

    if (id) {
      const { error } = await this.companyInfoService.updateService(id, this.serviceForm.label, this.serviceForm.description);
      if (!error) {
        this.toast.show('Service mis à jour', 'success');
      }
    } else {
      const { error } = await this.companyInfoService.createService(this.serviceForm.label, this.serviceForm.description);
      if (!error) {
        this.toast.show('Service ajouté', 'success');
      }
    }
    this.cancelEditService();
  }

  async deleteService(id: string): Promise<void> {
    if (!confirm('Supprimer ce service ?')) return;
    const { error } = await this.companyInfoService.deleteService(id);
    if (!error) {
      this.toast.show('Service supprimé', 'success');
    }
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
      await this.companyInfoService.reorderServices(newOrder);
    } else if (direction === 'down' && index < list.length - 1) {
      const newOrder = [list[index].id, list[index + 1].id];
      await this.companyInfoService.reorderServices(newOrder);
    }
  }

  // --- Company Values (About tab) ---
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
    if (!error) {
      this.toast.show('Engagement mis à jour', 'success');
    }
    this.cancelEditValue();
  }

  readonly availableIcons = ['engineering', 'handshake', 'workspace_premium', 'precision_manufacturing', 'support_agent', 'verified', 'security'];
}
```

- [ ] **Step 2: Commit**

Run: `git add src/app/pages/admin/company/company.ts && git commit -m "feat(admin): add CompanyAdmin component"`

---

## Task 6: Admin Company Page Template

**Files:** Create: `src/app/pages/admin/company/company.html`

Two tabs — "À propos" (services CRUD + values) and "Contact" (company info form).

```html
<div class="max-w-5xl mx-auto">
  <!-- Tab navigation -->
  <div class="flex gap-1 mb-8 border-b border-outline-variant">
    <button
      (click)="setTab('about')"
      class="px-4 py-2 font-label text-sm uppercase tracking-widest transition-colors"
      [class.text-primary]="activeTab() === 'about'"
      [class.border-b-2]="activeTab() === 'about'"
      [class.border-primary]="activeTab() === 'about'"
      [class.text-outline]="activeTab() !== 'about'"
    >À propos</button>
    <button
      (click)="setTab('contact')"
      class="px-4 py-2 font-label text-sm uppercase tracking-widest transition-colors"
      [class.text-primary]="activeTab() === 'contact'"
      [class.border-b-2]="activeTab() === 'contact'"
      [class.border-primary]="activeTab() === 'contact'"
      [class.text-outline]="activeTab() !== 'contact'"
    >Contact</button>
  </div>

  <!-- About Tab -->
  @if (activeTab() === 'about') {
    <div class="flex flex-col gap-12">

      <!-- Services CRUD -->
      <section>
        <h2 class="text-xl font-headline font-bold text-on-surface mb-6">Services</h2>
        <div class="flex flex-col gap-2">
          @for (service of services(); track service.id) {
            <div class="bg-surface-container-lowest border border-outline-variant/30 p-4 flex items-center gap-4">
              @if (editingServiceId() === service.id) {
                <!-- Edit mode -->
                <div class="flex-1 flex flex-col sm:flex-row gap-3">
                  <input [(ngModel)]="serviceForm.label" placeholder="Nom du service" class="flex-1 px-3 py-2 bg-surface border border-outline text-sm text-on-surface rounded" />
                  <input [(ngModel)]="serviceForm.description" placeholder="Description" class="flex-1 px-3 py-2 bg-surface border border-outline text-sm text-on-surface rounded" />
                </div>
                <div class="flex gap-2 shrink-0">
                  <button (click)="saveService()" class="px-4 py-2 bg-primary text-white text-sm font-bold rounded hover:brightness-110">Enregistrer</button>
                  <button (click)="cancelEditService()" class="px-4 py-2 bg-surface text-on-surface text-sm border border-outline rounded">Annuler</button>
                </div>
              } @else {
                <!-- View mode -->
                <div class="flex items-center gap-2 shrink-0 text-outline text-sm">
                  <button (click)="moveService(service.id, 'up')" class="p-1 hover:text-primary transition-colors">▲</button>
                  <button (click)="moveService(service.id, 'down')" class="p-1 hover:text-primary transition-colors">▼</button>
                  <span>{{ service.sort_order }}</span>
                </div>
                <div class="flex-1">
                  <div class="font-headline font-bold text-on-surface">{{ service.label }}</div>
                  <div class="text-sm text-on-surface-variant">{{ service.description }}</div>
                </div>
                <div class="flex gap-2 shrink-0">
                  <button (click)="startEditService(service.id)" class="px-3 py-1 text-sm text-primary border border-primary rounded hover:bg-primary hover:text-white transition-colors">Modifier</button>
                  <button (click)="deleteService(service.id)" class="px-3 py-1 text-sm text-error border border-error rounded hover:bg-error hover:text-white transition-colors">Supprimer</button>
                </div>
              }
            </div>
          }

          <!-- Add new service form -->
          @if (showAddService()) {
            <div class="bg-surface-container-low border border-primary/50 p-4 flex items-center gap-4">
              <div class="flex-1 flex flex-col sm:flex-row gap-3">
                <input [(ngModel)]="serviceForm.label" placeholder="Nom du service" class="flex-1 px-3 py-2 bg-surface border border-outline text-sm text-on-surface rounded" />
                <input [(ngModel)]="serviceForm.description" placeholder="Description" class="flex-1 px-3 py-2 bg-surface border border-outline text-sm text-on-surface rounded" />
              </div>
              <div class="flex gap-2 shrink-0">
                <button (click)="saveService()" class="px-4 py-2 bg-primary text-white text-sm font-bold rounded">Ajouter</button>
                <button (click)="showAddService.set(false)" class="px-4 py-2 bg-surface text-on-surface text-sm border border-outline rounded">Annuler</button>
              </div>
            </div>
          }

          <button (click)="showAddServiceForm()" class="self-start mt-2 px-4 py-2 border border-dashed border-outline text-sm text-outline hover:border-primary hover:text-primary transition-colors rounded">
            + Ajouter un service
          </button>
        </div>
      </section>

      <!-- Values Editor -->
      <section>
        <h2 class="text-xl font-headline font-bold text-on-surface mb-6">Engagements</h2>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          @for (value of companyValues(); track value.id) {
            <div class="bg-surface-container-lowest border border-outline-variant/30 p-6 flex flex-col gap-4">
              @if (editingValueId() === value.id) {
                <!-- Edit mode -->
                <div class="flex flex-col gap-3">
                  <div>
                    <label class="font-label text-[10px] uppercase tracking-widest text-outline mb-1 block">Icône</label>
                    <select [(ngModel)]="valueForm.icon" class="w-full px-3 py-2 bg-surface border border-outline text-sm text-on-surface rounded">
                      @for (icon of availableIcons; track icon) {
                        <option [value]="icon">{{ icon }}</option>
                      }
                    </select>
                  </div>
                  <div>
                    <label class="font-label text-[10px] uppercase tracking-widest text-outline mb-1 block">Titre</label>
                    <input [(ngModel)]="valueForm.title" class="w-full px-3 py-2 bg-surface border border-outline text-sm text-on-surface rounded" />
                  </div>
                  <div>
                    <label class="font-label text-[10px] uppercase tracking-widest text-outline mb-1 block">Description</label>
                    <textarea [(ngModel)]="valueForm.description" rows="3" class="w-full px-3 py-2 bg-surface border border-outline text-sm text-on-surface rounded resize-none"></textarea>
                  </div>
                  <div class="flex gap-2">
                    <button (click)="saveValue()" class="flex-1 px-3 py-2 bg-primary text-white text-sm font-bold rounded hover:brightness-110">Enregistrer</button>
                    <button (click)="cancelEditValue()" class="flex-1 px-3 py-2 bg-surface text-on-surface text-sm border border-outline rounded">Annuler</button>
                  </div>
                </div>
              } @else {
                <!-- View mode -->
                <div class="w-10 h-10 border border-primary flex items-center justify-center">
                  <span class="material-symbols-outlined text-primary" style="font-variation-settings: 'wght' 300;">{{ value.icon }}</span>
                </div>
                <div>
                  <div class="font-headline font-bold text-on-surface mb-1">{{ value.title }}</div>
                  <div class="text-sm text-on-surface-variant leading-relaxed">{{ value.description }}</div>
                </div>
                <button (click)="startEditValue(value.id)" class="mt-auto px-3 py-2 text-sm text-primary border border-primary rounded hover:bg-primary hover:text-white transition-colors self-start">
                  Modifier
                </button>
              }
            </div>
          }
        </div>
      </section>
    </div>
  }

  <!-- Contact Tab -->
  @if (activeTab() === 'contact') {
    <form (ngSubmit)="saveCompanyInfo(companyInfoForm)" #companyInfoForm="ngForm" class="flex flex-col gap-6 max-w-2xl">
      <div class="flex flex-col gap-1">
        <label class="font-label text-[10px] uppercase tracking-widest text-outline">Nom de l'entreprise</label>
        <input name="company_name" [ngModel]="companyInfo()?.company_name" class="px-3 py-3 bg-surface border border-outline text-on-surface rounded" />
      </div>
      <div class="flex flex-col gap-1">
        <label class="font-label text-[10px] uppercase tracking-widest text-outline">Tagline</label>
        <textarea name="tagline" [ngModel]="companyInfo()?.tagline" rows="2" class="px-3 py-3 bg-surface border border-outline text-on-surface rounded resize-none"></textarea>
      </div>
      <div class="flex flex-col gap-1">
        <label class="font-label text-[10px] uppercase tracking-widest text-outline">Label / Secteur</label>
        <input name="label" [ngModel]="companyInfo()?.label" class="px-3 py-3 bg-surface border border-outline text-on-surface rounded" />
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div class="flex flex-col gap-1">
          <label class="font-label text-[10px] uppercase tracking-widest text-outline">Jours</label>
          <input name="availability_days" [ngModel]="companyInfo()?.availability_days" class="px-3 py-3 bg-surface border border-outline text-on-surface rounded" />
        </div>
        <div class="flex flex-col gap-1">
          <label class="font-label text-[10px] uppercase tracking-widest text-outline">Horaires</label>
          <input name="availability_hours" [ngModel]="companyInfo()?.availability_hours" class="px-3 py-3 bg-surface border border-outline text-on-surface rounded" />
        </div>
      </div>
      <div class="flex flex-col gap-1">
        <label class="font-label text-[10px] uppercase tracking-widest text-outline">Email</label>
        <input name="contact_email" type="email" [ngModel]="companyInfo()?.contact_email" class="px-3 py-3 bg-surface border border-outline text-on-surface rounded" />
      </div>
      <div class="flex flex-col gap-1">
        <label class="font-label text-[10px] uppercase tracking-widest text-outline">Téléphone</label>
        <input name="contact_phone" type="tel" [ngModel]="companyInfo()?.contact_phone" class="px-3 py-3 bg-surface border border-outline text-on-surface rounded" />
      </div>
      <div class="flex flex-col gap-1">
        <label class="font-label text-[10px] uppercase tracking-widest text-outline">Adresse</label>
        <textarea name="contact_address" [ngModel]="companyInfo()?.contact_address" rows="2" class="px-3 py-3 bg-surface border border-outline text-on-surface rounded resize-none"></textarea>
      </div>
      <div class="flex flex-col gap-1">
        <label class="font-label text-[10px] uppercase tracking-widest text-outline">Mission quote</label>
        <textarea name="mission_quote" [ngModel]="companyInfo()?.mission_quote" rows="3" class="px-3 py-3 bg-surface border border-outline text-on-surface rounded resize-none"></textarea>
      </div>
      <button type="submit" class="self-start px-6 py-3 bg-primary text-white font-label text-sm uppercase tracking-widest font-bold rounded hover:brightness-110 transition-all">
        Enregistrer
      </button>
    </form>
  }
</div>
```

- [ ] **Step 2: Commit**

Run: `git add src/app/pages/admin/company/company.html && git commit -m "feat(admin): add CompanyAdmin template with two tabs"`

---

## Task 7: Public Pages — About + Services

**Files:**
- Modify: `src/app/pages/about/about.ts`
- Modify: `src/app/pages/about/about.html` — add loading skeleton
- Modify: `src/app/core/company-info.service.ts` — add loading signal for services

Update `CompanyInfoService` to expose services as async data the About page fetches on init. The About component injects `CompanyInfoService` and uses its signals directly. On `ngOnInit`, call `fetchServices()` and `fetchCompanyValues()`.

For the About page template, add a loading state using `@if (companyInfoService.services().length === 0)` to show a skeleton, else render the grid.

- [ ] **Step 2: Commit**

Run: `git add src/app/pages/about/about.ts src/app/pages/about/about.html && git commit -m "feat(about): read services and values from Supabase via CompanyInfoService"`

---

## Task 8: Public Pages — Contact

**Files:** Modify: `src/app/pages/contact/contact.ts`

Inject `CompanyInfoService`, call `fetchCompanyInfo()` on init, and use `companyInfo()` signal for contact data display (email, phone, address, hours).

- [ ] **Step 2: Commit**

Run: `git add src/app/pages/contact/contact.ts && git commit -m "feat(contact): read contact info from Supabase"`

---

## Spec Coverage Check

- [x] company_info table → Task 1
- [x] services table → Task 1
- [x] company_values table → Task 1
- [x] CompanyInfoService → Task 2
- [x] Supabase methods → Task 2
- [x] Admin sidebar nav → Task 3
- [x] /admin/company route → Task 4
- [x] CompanyAdmin component + template → Tasks 5 & 6
- [x] About page fetches from Supabase → Task 7
- [x] Contact page fetches from Supabase → Task 8