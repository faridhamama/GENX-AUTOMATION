# Company Info Admin — Specification

**Date:** 2026-05-10
**Status:** Approved
**Author:** Mohammed El-kabli

---

## Overview

An admin section to dynamically manage company information (contact info + about page content) stored in Supabase. Public pages read from Supabase instead of hardcoded config.

---

## Supabase Schema

### Table: `company_info`

Single row, key-value store for company-wide info.

| Column | Type | Description |
|--------|------|-------------|
| `id` | bigint | Primary key (always row with id=1) |
| `company_name` | text | "GENX AUTOMATION" |
| `tagline` | text | Hero tagline |
| `label` | text | "Automation & Industrial Engineering" label |
| `availability_hours` | text | "08:00 - 18:00" |
| `availability_days` | text | "Lundi - Vendredi" |
| `contact_email` | text | Contact email |
| `contact_phone` | text | Contact phone |
| `contact_address` | text | Physical address |
| `mission_quote` | text | Corporate mission quote |
| `updated_at` | timestamptz | Last update timestamp |

### Table: `services`

Ordered list of services (7 entries, order matters for display).

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `sort_order` | integer | Display order (1-7) |
| `label` | text | Service name |
| `description` | text | Service description |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | |

### Table: `company_values`

Exactly 3 rows, one per commitment card.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `sort_order` | integer | 1, 2, 3 |
| `icon` | text | Material symbol name (e.g. "engineering") |
| `title` | text | Value title |
| `description` | text | Value description |
| `updated_at` | timestamptz | |

---

## Admin Pages

### Route: `/admin/company`

New admin page at `/admin/company` with two tab sections:
- **À propos** — services list + values editor
- **Contact** — company info form

### Layout: Sidebar navigation

`AdminLayout` (`app-admin-layout`) gets a vertical nav sidebar:
- Tableau de bord (existing)
- **Entreprise** (section header)
  - À propos → `/admin/company/about`
  - Contact → `/admin/company/contact`

### Page: `/admin/company/about`

**Services section:**
- Table/list of all 7 services with drag-to-reorder handles
- Edit button per row → inline edit (label + description fields)
- Delete button (with confirmation)
- "Ajouter un service" button at bottom → new row in edit mode
- Sort order persisted to `services.sort_order`

**Values section:**
- 3 cards with edit button each
- Inline expansion: edit icon (dropdown of material symbols), title (text), description (textarea)
- No add/delete — exactly 3 values fixed

### Page: `/admin/company/contact`

Single-page form with fields:
- Nom de l'entreprise (text)
- Tagline (textarea)
- Label / Secteur (text)
- Horaires de disponibilité (text)
- Jours de disponibilité (text)
- Email (email input)
- Téléphone (tel input)
- Adresse (textarea)
- Mission quote (textarea)

Save button → `company_info` upsert (id=1 row). Success toast.

---

## Public Page Changes

### About Page (`about.ts` + `about.html`)

- Replace hardcoded `services` array with Supabase fetch
- Replace hardcoded `companyValues` array with Supabase fetch
- Add loading skeleton states while fetching
- `services` fetched with `order(sort_order.asc())`
- `companyValues` fetched with `order(sort_order.asc())`

### Contact Page

- Replace hardcoded contact info with Supabase fetch from `company_info`
- Show availability hours/days from config

### Services Page

- Replace hardcoded services with Supabase fetch (same data source as About)

---

## Component Inventory

### Admin Components

| Component | Path | Purpose |
|-----------|------|---------|
| `AdminLayout` | `shared/layout/admin-layout/` | Add sidebar nav |
| `CompanyAboutComponent` | `pages/admin/company/about/` | Services CRUD + values editor |
| `CompanyContactComponent` | `pages/admin/company/contact/` | Company info form |
| `CompanyInfoService` | `core/company-info.service.ts` | New service for company data operations |

### Public Components Changed

| Component | Change |
|-----------|--------|
| `AboutComponent` | Fetch services + companyValues from Supabase |
| `ContactComponent` | Fetch company_info from Supabase |
| `ServicesComponent` | Fetch services from Supabase |

---

## Services

### CompanyInfoService (`core/company-info.service.ts`)

```typescript
// company_info CRUD
getCompanyInfo(): Observable<CompanyInfo>
updateCompanyInfo(data): Observable<CompanyInfo>

// services CRUD
getServices(): Observable<Service[]>
createService(data): Observable<Service>
updateService(id, data): Observable<Service>
deleteService(id): Observable<void>
reorderServices(ids: string[]): Observable<void>

// company_values CRUD
getCompanyValues(): Observable<CompanyValue[]>
updateCompanyValue(id, data): Observable<CompanyValue>
```

---

## Out of Scope

- No authentication changes (auth already exists in dashboard)
- No image uploads (images stay in `images.config.ts`)
- No multi-language support
- No versioning/rollback of changes
- No draft/preview flow
- No new Supabase tables beyond the 3 defined above