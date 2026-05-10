# About Page Redesign — Company Page for GENX AUTOMATION

**Date:** 2026-05-10
**Status:** Approved
**Author:** Mohammed El-kabli

---

## Overview

The About page currently presents Farid Hamama as an individual founder/engineer. It is being redesigned to present GENX AUTOMATION as a full-stack industrial automation and electrical engineering company. Farid Hamama is removed entirely. The page reflects the company's legal corporate scope and identity.

---

## Section 1: Hero

- **Label:** "Automation & Industrial Engineering" (replaces "Fondateur & Ingénieur")
- **Heading:** "GENX AUTOMATION" (replaces "Farid Hamama")
- **Tagline:** *"Solutions complètes d'automatisme industriel, de génie électrique et de supervision au Maroc."*
- **Availability block:** Retained as company hours — "Lundi - Vendredi / 08:00 - 18:00"

---

## Section 2: Mission

- **Quote (corporate):** *"Offrir aux industriels marocains des solutions d'automatisation complètes, fiables et adaptées à leurs besoins réels — de la conception à la mise en service."*
- **Image:** Retained — industrial control panel photo
- **Company info card:** Founding context — company name, sector, what it stands for. No personal founder info.

---

## Section 3: Services Grid (NEW — core addition)

7 business lines displayed as a clean grid/bento layout:

| # | Service | Description |
|---|---------|-------------|
| 1 | Automatisme industriel | Programmation et mise en service d'automates (PLC) — toute marque et technologie |
| 2 | Supervision (SCADA/IHM) | Conception, intégration et exploitation de systèmes de supervision et interfaces homme-machine |
| 3 | Génie électrique (BT/MT) | Études, fourniture, installation et mise en service — tableaux électriques, armoires, postes de transformation |
| 4 | Instrumentation industrielle | Fourniture, installation, étalonnage et maintenance d'instruments de mesure et capteurs |
| 5 | Intégration de systèmes | Architectures complètes, communication industrielle (Modbus, Profibus, Profinet, OPC-UA), liaison MES/ERP |
| 6 | Assistance technique & formation | Conseil, audits, études de faisabilité, formation du personnel, AMO |
| 7 | Commercialisation & distribution | Importation et distribution de matériel d'automatisme, instrumentation et électricité industrielle |

---

## Section 4: Values

Replace personal values with company-level values:

| Icon | Title | Description |
|------|-------|-------------|
| engineering | Rigueur industrielle | Une discipline forgée par des années d'expérience terrain sur des sites où la précision est une nécessité absolue |
| handshake | Transparence totale | Offrir ce dont le client a vraiment besoin — sans surdimensionnement ni promesses impossibles à tenir |
| workspace_premium | Savoir-faire concret | Du code, des schémas, des tests en situation réelle. Nous livrons ce que nous promettons |

---

## Section 5: Dual CTA

Two equally prominent calls-to-action:

- **"Discuter de votre projet"** → links to `/contact`
- **"Voir nos références"** → links to `/references`

Both styled as equal-weight buttons in the CTA section.

---

## Files to Modify

- `src/app/pages/about/about.html` — Full template rewrite (5 sections)
- `src/app/pages/about/about.ts` — Component: remove personal capabilities, replace with services grid data structure + company values
- `src/app/core/navigation.config.ts` — Update nav label if needed (currently "À Propos" — keep or change to "À Propos" / "Société")
- `src/app/app.routes.ts` — No route change needed

---

## Out of Scope

- No mention of Farid Hamama anywhere on the page
- No personal statistics (years of experience, PLC brands as personal expertise)
- No changes to other pages (home, references, contact)
- No new components — reuse existing layout patterns (bento grid, values section, CTA section)
