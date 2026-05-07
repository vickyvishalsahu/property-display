export type HelpEntry = {
  title: string
  body: string
}

export const HELP_CONTENT: Record<string, HelpEntry> = {
  administration: {
    title: 'Administration',
    body: 'The manager oversees day-to-day operations of the property — maintenance, communication with owners or tenants, and compliance. The accountant handles financial reporting, cost allocation, and annual statements. Both roles are assigned per property.',
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
}
