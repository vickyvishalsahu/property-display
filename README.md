# Buena — Property Management MVP

A focused internal tool for property managers. Built as a case study MVP with two surfaces: a portfolio dashboard and a property creation flow.

## Demo

- [Walkthrough Part 1](https://www.loom.com/share/a7224bfdd2764155a18fda43d5ba0a5e)
- [Walkthrough Part 2](https://www.loom.com/share/56b6f21bd5f34df6bf024ac16a96537c)

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
