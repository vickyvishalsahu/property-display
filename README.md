# Buena — Property Management MVP

A focused internal tool for property managers. Built as a case study MVP with two surfaces: a portfolio dashboard and a property creation flow.

---

## What it does

Buena acquires traditional German property management companies (*Hausverwaltungen*) and runs them on a unified platform. This MVP demonstrates the core loop:

1. **Dashboard** — view all properties at a glance (name, type, buildings, units, assigned manager)
2. **Add Property** — register a new property into the system via a guided flow

No accounting, no tenant communications, no compliance tooling — just the essential: get a property in, see it immediately.

---

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| Runtime | React 19 |
| Package manager | pnpm |

---

## Project structure

```
app/
  page.tsx                  # Dashboard — property portfolio grid
  layout.tsx                # Root layout with nav
  properties/new/page.tsx   # Add property flow
constants/
  propertyTypes.ts          # Management type labels (WEG, MV)
  unitTypes.ts              # Unit type definitions
hooks/
  useProperties.ts          # Property data hook
mock/
  properties.ts             # Seed data — mock property portfolio
  staff.ts                  # Seed data — mock staff members
types/
  property.ts               # Core domain types (Property, Building, Unit, Address)
  staff.ts                  # Staff types
```

---

## Domain model

Properties are typed by management model:

- **WEG** (*Wohnungseigentümergemeinschaft*) — condominium association; units carry a co-ownership share
- **MV** (*Mietverwaltung*) — rental management; units are standard rental units

Each property has one or more buildings, each building has one or more addresses and a list of units.

```
Property (WEG | MV)
  └── buildings[]
        ├── addresses[]   (street, number, postal code, city)
        └── units[]       (type, floor, entrance, size, rooms)
```

---

## Getting started

```bash
pnpm install
pnpm dev
```

App runs at `http://localhost:3000`.

---

## Routes

| Route | Description |
|-------|-------------|
| `/` | Property dashboard |
| `/properties/new` | Add a new property |

---

## Development

```bash
pnpm dev       # Start dev server
pnpm build     # Production build
pnpm lint      # ESLint
pnpm release   # Merge dev → main with tagging
```

Branches: `dev` for active work, `main` for releases. Never commit directly to `main`.
