# About Page Company Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the personal-founder About page with a company About page for GENX AUTOMATION. Remove all references to Farid Hamama. Add a services grid covering all 7 business lines.

**Architecture:** Three files modified: `about.ts` (data only), `about.html` (full template rewrite), `navigation.config.ts` (optional label update). No new components, no route changes.

**Tech Stack:** Angular standalone component, Tailwind v4 via MD3 theme, Angular Router.

---

## File Map

| File | Responsibility |
|------|----------------|
| `src/app/pages/about/about.ts` | Component class: replace `capabilities[]` with `services[]`, replace `companyValues[]` with company values |
| `src/app/pages/about/about.html` | Full template: 5 sections (Hero, Mission, Services Grid, Values, Dual CTA) |
| `src/app/core/navigation.config.ts` | Nav label — change "À Propos" to "Société" |

---

## Task 1: Replace component data in `about.ts`

**Files:** Modify: `src/app/pages/about/about.ts`

- [ ] **Step 1: Replace `capabilities` interface and array with `services`**

Remove the `Capability` interface and `capabilities` array. Add a `Service` interface and `services` array with 7 entries matching the spec:

```typescript
interface Service {
  label: string;
  description: string;
}

readonly services: Service[] = [
  {
    label: 'Automatisme industriel',
    description: 'Programmation et mise en service d\'automates (PLC) — toute marque et technologie',
  },
  {
    label: 'Supervision (SCADA/IHM)',
    description: 'Conception, intégration et exploitation de systèmes de supervision et interfaces homme-machine',
  },
  {
    label: 'Génie électrique (BT/MT)',
    description: 'Études, fourniture, installation et mise en service — tableaux électriques, armoires, postes de transformation',
  },
  {
    label: 'Instrumentation industrielle',
    description: 'Fourniture, installation, étalonnage et maintenance d\'instruments de mesure et capteurs',
  },
  {
    label: 'Intégration de systèmes',
    description: 'Architectures complètes, communication industrielle (Modbus, Profibus, Profinet, OPC-UA), liaison MES/ERP',
  },
  {
    label: 'Assistance technique & formation',
    description: 'Conseil, audits, études de faisabilité, formation du personnel, AMO',
  },
  {
    label: 'Commercialisation & distribution',
    description: 'Importation et distribution de matériel d\'automatisme, instrumentation et électricité industrielle',
  },
];
```

- [ ] **Step 2: Replace `companyValues` array**

Remove the existing `CompanyValue` interface and `companyValues` array. Add new company values:

```typescript
interface CompanyValue {
  icon: string;
  title: string;
  description: string;
}

readonly companyValues: CompanyValue[] = [
  {
    icon: 'engineering',
    title: 'Rigueur industrielle',
    description: 'Une discipline forgée par des années d\'expérience terrain sur des sites où la précision est une nécessité absolue',
  },
  {
    icon: 'handshake',
    title: 'Transparence totale',
    description: 'Offrir ce dont le client a vraiment besoin — sans surdimensionnement ni promesses impossibles à tenir',
  },
  {
    icon: 'workspace_premium',
    title: 'Savoir-faire concret',
    description: 'Du code, des schémas, des tests en situation réelle. Nous livrons ce que nous promettons',
  },
];
```

- [ ] **Step 3: Commit**

Run: `git add src/app/pages/about/about.ts && git commit -m "refactor(about): replace personal data with company services and values"`

---

## Task 2: Rewrite `about.html` template

**Files:** Modify: `src/app/pages/about/about.html`

The template is rewritten in 5 sections. Preserve all existing Tailwind classes and MD3 theme tokens from the original file.

### Section 1: Hero (replace lines 1–27)

- Label: "Automation & Industrial Engineering"
- Heading: "GENX AUTOMATION"
- Tagline paragraph: "Solutions complètes d'automatisme industriel, de génie électrique et de supervision au Maroc."
- Keep the availability block unchanged (company hours)

### Section 2: Mission (replace lines 29–52)

- Replace "Ma Mission" label with "Notre Mission"
- Replace personal quote with corporate mission: "Offrir aux industriels marocains des solutions d'automatisation complètes, fiables et adaptées à leurs besoins réels — de la conception à la mise en service."
- Replace the "founder info" card with a company info card: GENX AUTOMATION name, sector label "Automation & Ingénierie Industrielle", founding context line ("Au service des industriels marocains depuis [year]")
- Keep the industrial control panel image

### Section 3: Services Grid (replace lines 53–88)

- Title: "Nos Services"
- Subtitle: "Un accompagnement complet, de l'étude à la mise en service"
- Grid layout using the existing bento grid pattern (2 columns on small, responsive)
- Loop over `services` array (not `capabilities`):
  ```html
  @for (service of services; track service.label) {
    <div>
      <div class="font-headline text-lg font-bold mb-2 text-on-surface">{{ service.label }}</div>
      <p class="text-sm text-on-surface-variant leading-relaxed">{{ service.description }}</p>
    </div>
  }
  ```

### Section 4: Values (replace lines 90–123)

- Title: "Nos Engagements"
- Keep the existing 3-column values grid using `companyValues`
- Each value card: icon, title, description — same structure as original

### Section 5: Dual CTA (replace lines 125–148)

- Keep the existing CTA section structure
- Button 1: "Discuter de votre projet" → `/contact`
- Button 2: "Voir nos références" → `/references`
- Both buttons equal weight (matching the spec's dual CTA design)

- [ ] **Step 2: Commit**

Run: `git add src/app/pages/about/about.html && git commit -m "feat(about): rewrite as company page — GENX AUTOMATION"`

---

## Task 3: Update navigation label

**Files:** Modify: `src/app/core/navigation.config.ts`

- [ ] **Step 1: Change nav label "À Propos" → "Société"**

```typescript
{ label: 'Société', path: '/about' },
```

- [ ] **Step 2: Commit**

Run: `git add src/app/core/navigation.config.ts && git commit -m "feat(nav): rename 'À Propos' to 'Société'"`

---

## Spec Coverage Check

- [x] Hero — company name, tagline, availability block → Task 2 Section 1
- [x] Mission — corporate quote + company info card → Task 2 Section 2
- [x] Services Grid — 7 business lines → Task 1 (data) + Task 2 Section 3
- [x] Values — company values (3 entries) → Task 1 (data) + Task 2 Section 4
- [x] Dual CTA — contact + references → Task 2 Section 5
- [x] No Farid Hamama mentions → Tasks 1 and 2
- [x] Nav label update → Task 3
