export const NAVIGATION = {
  brand: 'Buena',
  addProperty: 'Add Property',
  metaTitleTemplate: 'Buena | %s',
  metaDefaultTitle: 'Buena',
  metaDescription: 'Property management, simplified.',
}

export const DASHBOARD = {
  title: 'Properties',
  totalCount: (count: number) => `${count} total`,
  buildingCount: (count: number) => `${count} ${count === 1 ? 'building' : 'buildings'}`,
  unitCount: (count: number) => `${count} ${count === 1 ? 'unit' : 'units'}`,
  managerLabel: 'Manager',
  demoBadge: 'Demo',
  searchPlaceholder: 'Search by name, address or manager…',
  noResults: (query: string) => `No properties match "${query}".`,
  emptyHeading: 'No properties yet',
  emptyDescription: 'Add your first property to get started.',
}

export const PROPERTY_NOT_FOUND = {
  heading: 'Property not found',
  description: 'This property does not exist or may have been removed.',
  backLink: 'Back to properties',
}
