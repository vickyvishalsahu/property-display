# Buena — Property Management MVP

A focused internal tool for property managers. Built as a case study MVP with two surfaces: a portfolio dashboard and a property creation flow.

---

## What it does

Buena acquires traditional German property management companies (*Hausverwaltungen*) and runs them on a unified platform. This MVP demonstrates the core loop:

1. **Dashboard** — view all properties at a glance (name, type, buildings, units, assigned manager); search by name, address, or manager
2. **Add Property** — register a new property via a guided multi-step flow
3. **PDF Import** — upload a property document (Teilungserklärung, Mietvertrag, etc.) and have the details extracted automatically via AI

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
| AI extraction | Groq (`llama-3.3-70b-versatile`) |
| PDF parsing | pdfjs-dist (client-side) |
| Address lookup | Google Maps Places API |

---

## Project structure

```
app/
  page.tsx                                  # Dashboard — property portfolio grid
  layout.tsx                                # Root layout with nav
  _components/
    DashboardPage.tsx                       # Dashboard client component (search, cards, skeletons)
  property-creation/
    layout.tsx                              # Property creation section layout
    new/page.tsx                            # Add property — method select + step 1
    [id]/page.tsx                           # Edit property — step 1
    [id]/buildings/page.tsx                 # Step 2 — buildings & units
    [id]/review/page.tsx                    # Step 3 — review & publish
  api/
    extract-property/route.ts               # POST — PDF text → AI → PropertyImport JSON

domains/
  shared/
    types/
      property.ts                           # Core domain types (Property, Building, Unit, Address)
      propertyImport.ts                     # Import types (partial data from PDF extraction)
      staff.ts                              # Staff types
    constants/
      propertyTypes.ts                      # Management type labels (WEG, MV)
      helpContent.ts                        # Contextual help copy
      strings.ts                            # All shared UI strings (i18n-ready)
    hooks/
      useProperties.ts                      # Property CRUD hook (localStorage-backed)
      usePlaces.ts                          # Google Maps Places autocomplete hook
      useAddressAutocomplete.ts             # Address search state, predictions, and selection logic
    mock/
      properties.ts                         # Seed data — 4 demo properties
      staff.ts                              # Seed data — mock staff members
    components/
      AddressAutocomplete.tsx               # Address search input (Places API)
      HelpPanel.tsx                         # Slide-in contextual help panel
      HelpSection.tsx                       # Section wrapper with help trigger
      HelpTrigger.tsx                       # ? button that opens the panel
      SkeletonLoading.tsx                   # Reusable skeleton block list
    context/
      HelpPanelContext.tsx                  # Help panel open/close state
    providers/
      GoogleMapsProvider.tsx                # Google Maps JS API loader
    utils/
      cn.ts                                 # Class name utility
  propertyCreation/
    components/
      StepManagementType.tsx                # Management type picker (WEG / MV photo cards)
      StepProperty.tsx                      # Step 1 — name, manager, accountant
      StepBuildings.tsx                     # Step 2 — buildings & units
      StepReview.tsx                        # Step 3 — review & confirm
      BuildingForm.tsx                      # Per-building form with unit rows
      PropertyStepper.tsx                   # Step indicator with completion rings
      DraftCard.tsx                         # Draft property card on dashboard
      PropertyNotFound.tsx                  # 404 fallback for unknown property IDs
    hooks/
      usePropertyForm/
        index.ts                            # Form state + draft/publish logic
        utils.ts                            # Form helpers
      formFromImport.ts                     # PropertyImport → Partial<FormState> mapper
    constants/
      unitTypes.ts                          # Valid unit types + labels
      strings.ts                            # Property creation UI strings
    types/
      form.ts                               # Form state types
    utils/
      stepCompletion.ts                     # Step validation and completion state
  extraction/
    components/
      PdfImport.tsx                         # PDF upload UI with loading/error states
    hooks/
      usePropertyExtraction.ts              # PDF text → API → parsed import data
    constants/
      strings.ts                            # Extraction UI strings
```

---

## Domain model

Properties are typed by management model:

- **WEG** (*Wohnungseigentümergemeinschaft*) — condominium association; units carry a co-ownership share (MEA)
- **MV** (*Mietverwaltung*) — rental management; units are standard rental units

```
Property (WEG | MV)
  └── buildings[]
        ├── addresses[]   (street, number, postal code, city — corner buildings can have two)
        └── units[]       (number, type, floor, entrance, size, rooms, constructionYear, coOwnershipShare)
```

---

## Getting started

```bash
pnpm install
pnpm dev
```

Copy `.env.example` to `.env.local` and fill in the required keys:

```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=   # Google Maps JS API key (Places API enabled)
GROQ_API_KEY=                      # Groq API key for AI extraction
```

App runs at `http://localhost:3000`.

---

## Routes

| Route | Description |
|-------|-------------|
| `/` | Property dashboard |
| `/property-creation/new` | Add a new property (manual or PDF import) |
| `/property-creation/[id]` | Edit property — step 1 (name, manager, accountant) |
| `/property-creation/[id]/buildings` | Edit property — step 2 (buildings & units) |
| `/property-creation/[id]/review` | Edit property — step 3 (review & publish) |

---

## PDF import flow

1. User uploads a PDF on the `/property-creation/new` method selection screen
2. Text is extracted client-side with `pdfjs-dist`
3. Text is sent to `POST /api/extract-property`
4. The API calls Groq with a German real estate domain prompt (JSON mode, up to 2 retries)
5. The validated `PropertyImport` is returned and used to pre-fill the wizard
6. User reviews the extracted data, fills any gaps, and publishes

---

## Development

```bash
pnpm dev       # Start dev server
pnpm build     # Production build
pnpm test      # Run tests (Vitest)
pnpm lint      # ESLint
pnpm release   # Merge dev → main with tagging
```

Branches: `dev` for active work, `main` for releases. Never commit directly to `main`.
