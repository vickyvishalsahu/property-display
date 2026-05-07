# Architectural Decision Records — Buena Case Study

---

## ADR-001: Core Property Data Model

### Context

A Buena property is either WEG (co-ownership) or MV (rental management). The key structural difference: WEG units carry a `coOwnershipShare` (MEA) used for cost allocation and voting weight; MV units do not. This isn't a UI preference — it reflects a legal distinction between the two management regimes.

The question was how to represent this distinction in TypeScript.

### Options considered

**A — Shared type with optional field**
```ts
type Unit = {
  coOwnershipShare?: number  // only meaningful for WEG
}
```
Simple to define. But `?` means "might be there" — the type allows MV units with a co-ownership share, and WEG units without one. Both are invalid states that the type system doesn't catch. Every consumer would need a runtime guard or a silent assumption.

**B — TypeScript discriminated union**
```ts
type WEGUnit = BaseUnit & { coOwnershipShare: number }
type MVUnit = BaseUnit  // no coOwnershipShare at all
type WEGProperty = BaseProperty & { managementType: 'WEG'; buildings: WEGBuilding[] }
type MVProperty  = BaseProperty & { managementType: 'MV';  buildings: MVBuilding[]  }
type Property = WEGProperty | MVProperty
```

### Decision: discriminated union (B)

Invalid states become compile errors. `MVUnit` doesn't have `coOwnershipShare` as optional — it simply doesn't exist on the type. When narrowing on `managementType`, TypeScript statically knows which unit shape is present. No runtime guarding needed anywhere.

### Tradeoffs

- More verbose type definitions — worth it for the safety guarantees at scale
- Consumers must narrow before accessing `coOwnershipShare` — an intentional forcing function, not a friction cost
- Adding a new management type in the future requires extending the union, not retrofitting a flag

### Consequence

The form mirrors this: `coOwnershipShare` renders only when `managementType === 'WEG'`, and `buildProperty()` maps to the correct discriminated branch at submit time. The type system prevents a WEG submit from accidentally creating an MV-shaped record.

---

### Related: Building address tuple

Building addresses are typed as `[Address, ...Address[]]` — a variadic tuple, not `Address[]`.

This enforces minimum one address at the type level (a building with no address is invalid) while allowing a second address for corner buildings without overcomplicating the model with a separate "corner building" flag. The second address slot is a product of the physical world: a corner building faces two streets and is registered under both.

---

## ADR-002: Property Creation Wizard

### Context

A property has a 3-level hierarchy: Property → Building → Unit. The WEG/MV fork happens at the top level and gates the entire form — a WEG property needs co-ownership shares on every unit; an MV property doesn't. Presenting the full form without first establishing management type would force branching logic to live in every field.

The secondary question was scope: one building per property, or many?

### Options considered for form structure

**A — Single long form with progressive disclosure**
Everything on one page, fields appear/disappear as sections expand. Flexible, but the management type fork creates a huge conditional branch mid-page. Hard to express hierarchy visually.

**B — Accordion**
Similar to A but with explicit section collapse. Doesn't enforce step order — a user can enter units before setting the management type, leading to invalid intermediate states.

**C — 3-step wizard**
- Step 1: Property (management type, name, manager, accountant)
- Step 2: Buildings + units
- Step 3: Review + submit

### Decision: wizard (C)

Maps 1:1 to the domain aggregates. Management type is locked in at step 1 — the rest of the form is well-defined from that point. Step 3 gives a read-only summary before committing, which reduces the "I didn't realise what I was submitting" problem. The wizard structure also makes the creation flow clearly separate from the dashboard, which is semantically correct: creation is a transaction, browsing is not.

### Tradeoffs

- More navigation scaffolding (stepper, back/next, step state)
- Users can't skip ahead — acceptable here because step dependencies are real, not artificial

### On scope: multiple buildings

Initial design scoped to one building per property. Revised after reviewing the mock data, which already includes multi-building properties. A creation UI that can't reproduce what the dashboard displays is a visible inconsistency — it signals that the mock is aspirational rather than representative. Supporting multiple buildings required only an `addBuilding` / `removeBuilding` pair in the form hook; the cost was low.

### On unit fields

All unit fields are included (number, type, floor, entrance, size, rooms, construction year, co-ownership share for WEG). The goal was full type fidelity — no drift between the data model and what the form can express. A stripped-down form would save UI surface but force assumptions about which fields "don't matter," which is a product decision, not a data model decision.

---

## ADR-003: Help Panel Architecture

### Context

The target user is a domain expert (property manager, accountant) learning to use new software. They need brief, Buena-specific clarification for terms like WEG, MV, MEA — not tutorials. The help system needed to be discoverable but not intrusive; persistent enough to read while interacting with the form; and data-driven so content can be updated without touching component code.

### Options considered

**A — Tooltip**
Appears on hover. Too short for a full definition. Mobile-hostile (no hover state). Dismissed on cursor movement — user can't read it while filling in a field.

**B — Inline text (always visible)**
No interaction required. But permanently consuming layout space for content most users won't read every session. Doesn't scale to many terms.

**C — Popover (lightweight flyout)**
Dismisses on outside click. Works, but doesn't persist — user reads, clicks elsewhere, content disappears. Not ideal for reference while typing.

**D — Sidebar drawer (right-aligned panel)**
Persists until explicitly closed. Wide enough for a full paragraph. Doesn't cover the form — sits alongside it. ESC and overlay click to close. State lives at layout level so it survives route changes.

### Decision: sidebar drawer (D)

The sidebar is slightly over-engineered for the immediate user need — a tooltip would technically suffice for one or two terms. The decision to use a sidebar was deliberate for the case study context: it demonstrates global state management, layout-level component architecture, and a data-driven content pattern — all of which are relevant signals for a senior engineering assessment.

### State placement

State lives in React Context at layout level (`HelpPanelContext`). Alternatives:

- **URL params** (`?help=weg`): bookmarkable, but adds history entries for every `?` click, and help content isn't the kind of thing a user needs to share or return to via URL
- **Page-level state**: simpler, but the panel closes on navigation — not desirable if the user needs to check a term while moving between steps
- **Layout-level context**: persists across steps, no URL noise, accessible from any component in the tree via `useHelpPanel()`

### Content layer

Driven by a static `Record<termId, { title, body }>` in `constants/helpContent.ts`. The `termId` string is the coupling point between triggers (`<HelpTrigger termId="weg" />`) and content. This is easy to hand off to a CMS or API: swap the static record for a fetch, no component changes needed.

---

## ADR-004: Help Trigger Pattern Evolution

### Context

Once the sidebar was wired up, the question was how to expose the trigger in the UI. This went through several iterations.

### Phase 1 — Per-option triggers (initial approach)

A `?` icon next to each of the WEG and MV toggle buttons:

```
[WEG] [?]   [MV] [?]
```

Each `?` opened a different help entry (`weg` and `mv` respectively). Technically correct — but visually noisy. Two adjacent `?` icons invite the user to wonder what's different about them. The proximity to the buttons implies "help about this button" rather than "help about this concept."

### Phase 2 — Single trigger on the concept label

Moved to one `?` on the "Management type" label, opening a combined entry that covers both WEG and MV:

```
Management type  [?]
[WEG]  [MV]
```

One trigger per concept, not per option. The `management-type` help entry contains the full contrast. Cleaner visually, semantically correct — the user needs context about the concept, not the individual value.

### Phase 3 — HelpSection wrapper component

The label + `?` + children pattern appeared repeatedly across form sections. Without a wrapper, each section required the same manual composition:

```tsx
<div>
  <div className="flex items-center gap-1.5 mb-2">
    <label className="text-sm font-medium text-gray-700">Management type</label>
    <HelpTrigger termId="management-type" />
  </div>
  {children}
</div>
```

Three options for standardising this:

**A — Wrapper component (`HelpSection`)**
```tsx
<HelpSection label="Management type" termId="management-type">
  {children}
</HelpSection>
```
Simple, composable. `label` is a display text prop — no `<label>` HTML element, so form semantics stay with the caller (who owns the `<select>` or `<input>`). Works for 90% of cases.

**B — Higher-order component (HOC)**
`withHelp(Component, { label, termId })`. Harder to type correctly in React 19. Position of the `?` is hardcoded relative to the wrapped component — no flexibility. HoCs add an extra layer in the component tree, making DevTools harder to read.

**C — Render prop / hook**
`useHelpSection({ label, termId })` returns a `renderHeader()` function. Flexible, but verbose — every consumer must call and render the return value. Flexibility that isn't used is just ceremony.

### Decision: wrapper component (A) with HelpTrigger kept as primitive

`HelpSection` handles the standard case. `HelpTrigger` remains as the escape hatch for non-standard placements (e.g., a `?` inside a table header, or mid-sentence in a description). The two are complementary, not competing.

Key constraint: `HelpSection` must not render a `<label>` HTML element. A `<label>` is a form semantic that associates text with a specific input — it's not a display wrapper. The component name contains "Section," not "Label," for this reason. Callers retain full control over their form element associations.

---

## ADR-005: Testing Strategy — Sequencing and Scope

### Context

Tests were introduced after the DDD restructure, not at the start of the project. This was deliberate, not an oversight.

### Why tests were written after DDD, not upfront

The initial build established domain boundaries: property types, form state, wizard steps. Writing tests during this phase would have anchored mocks and import paths to the flat structure (`@/hooks/usePropertyForm`, `@/components/HelpSection`, etc.). When the DDD restructure moved those modules to `@/domains/propertyCreation/hooks/usePropertyForm`, every mock path would have needed updating alongside the production code. Tests written against an unstable structure become friction, not safety — they break during refactoring even when behaviour hasn't changed.

The correct sequencing was: establish stable module boundaries first, then write tests that target those boundaries. The `domains/` layout is the stable surface. Mocks now point at paths that won't move again without a deliberate architectural decision.

### Framework: Vitest over Jest

Vitest is the Next.js 16 recommended test runner (per `node_modules/next/dist/docs/01-app/02-guides/testing/vitest.md`). It supports ESM natively — no Babel transform needed, no `next/jest` wrapper, no module resolution shims. Path alias resolution comes from `resolve.tsconfigPaths: true`, reading directly from `tsconfig.json`. Lower config surface, faster execution.

### What is tested and why

Tests target logic that catches real bugs:

- **Hook state transitions** (`usePropertyForm`): the form is the core of the creation domain. `removeBuilding`, `toggleSecondAddress`, `updateAddress`, and `updateUnit` all contain targeting logic — operate on the wrong building or unit and data is silently corrupted. These are the most valuable tests in the suite.
- **Conditional rendering** (`BuildingForm`, `StepReview`): the WEG/MV fork is the central structural distinction of the data model. A regression here — MEA field visible for MV, or hidden for WEG — would violate the discriminated union invariant at the UI level.
- **Form validation gating** (`StepProperty`): the `canProceed` predicate controls whether the user can advance. A regression here blocks the entire creation flow or allows submitting with missing required fields.

### What is not tested and why

- **Trivial setters** (`setName`, `setManagerId`, `setAccountantId`): each is a one-line state update with no branching. A broken setter would surface immediately in manual use and can't silently produce invalid data.
- **Pure display with no branching** (`StepBuildings` navigation buttons, `StepReview` address formatting): these render fixed markup from props. No conditional logic, no state — nothing to test beyond "it rendered."
- **Simple prop-passing**: testing that a component forwards a prop to a child component tests the framework, not the application.

### Bonus fix surfaced by tests

The `removeBuilding` hook function had no guard against removing the last building. The UI enforced this via a `canRemove={buildings.length > 1}` prop, but the hook itself would produce an empty buildings array if called directly. The test exposed this mismatch — the invariant belonged in the hook, not silently delegated to the consumer. The guard was added to `usePropertyForm` as a result.
