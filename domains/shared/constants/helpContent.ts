export type HelpEntry = {
  title: string
  body: string
}

export const HELP_CONTENT: Record<string, HelpEntry> = {
  administration: {
    title: 'Administration',
    body: 'The **manager** oversees day-to-day operations of the property — maintenance, communication with owners or tenants, and compliance.\n\nThe **accountant** handles financial reporting, cost allocation, and annual statements.\n\nBoth roles are mandatory and assigned per property.',
  },
  'management-type': {
    title: 'Management type',
    body: 'WEG (Wohnungseigentümergemeinschaft) is a co-ownership structure where multiple owners share a building — each unit carries a co-ownership share used for cost allocation. MV (Mietverwaltung) is rental management on behalf of an owner — no shared ownership, no co-ownership shares.',
  },
  weg: {
    title: 'WEG — Wohnungseigentümergemeinschaft',
    body: 'A co-ownership structure where multiple owners each hold a unit and share common areas. Each unit carries a co-ownership share (MEA) used for cost allocation.',
  },
  mv: {
    title: 'MV — Mietverwaltung',
    body: 'Rental management on behalf of a single owner or group of owners. No co-ownership shares — the owner retains full title.',
  },
  mea: {
    title: 'MEA — Miteigentumsanteil',
    body: 'The co-ownership share assigned to each unit in a WEG property. Used to calculate each owner\'s proportion of shared costs and voting weight.',
  },
  units: {
    title: 'Units',
    body: 'A unit is any individually identifiable space in a building — apartment, commercial unit, parking spot, or storage room. Add one row per unit.\n\n**Number** — internal identifier used across documents and cost statements. Usually matches the official apartment number.\nExample: 12, EG-links, B-04\n\n**Type** — the use category: residential, commercial, parking, storage, garden plot, or other.\n\n**Floor** — the level the unit sits on. Ground floor is 0, first floor above is 1, basement is −1.\n\n**Entrance** — stairwell or entrance door that leads to the unit, if the building has more than one. Optional.\nExample: A, B, Haupteingang\n\n**Size** — usable floor area in square metres.\nExample: 68.5\n\n**Rooms** — habitable rooms only, not counting kitchen, bathroom, or hallway. A typical 2-bedroom apartment with a living room counts as 3.\n\n**Construction year** — the year the building was completed, not the unit.\nExample: 1978\n\n**Co-ownership share (WEG only)** — the MEA (Miteigentumsanteil) from the declaration of division. Determines each owner\'s share of shared costs and voting weight.\nExample: 253.47',
  },
}
