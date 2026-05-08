export const PROPERTY_PAGES = {
  addHeading: 'Add Property',
  editHeading: 'Edit Property',
}

export const DRAFT_CARD = {
  untitledDraft: 'Untitled draft',
  badge: 'Draft',
  continue: 'Continue →',
  discard: 'Discard',
}

export const PROPERTY_STEPPER = {
  steps: ['Property', 'Buildings', 'Review'] as const,
}

export const STEP_MANAGEMENT_TYPE = {
  sectionLabel: 'Management type',
  backButton: '← Back',
  confirmSwitchToMV: 'Switching to MV will clear co-ownership shares from all units. Continue?',
  confirmSwitchToWEG: 'Switching to WEG will require you to add co-ownership shares for each unit. Continue?',
}

export const STEP_PROPERTY = {
  managementTypePrefix: 'Management type:',
  propertyNameLabel: 'Property name',
  propertyNamePlaceholder: 'e.g. Togostraße Eigentümergemeinschaft',
  administrationLabel: 'Administration',
  managerLabel: 'Manager',
  managerPlaceholder: 'Select manager',
  accountantLabel: 'Accountant',
  accountantPlaceholder: 'Select accountant',
  required: 'Required',
  backButton: '← Back',
  nextButton: 'Next',
}

export const STEP_BUILDINGS = {
  addBuilding: '+ Add building',
  backButton: '← Back',
  nextButton: 'Next',
}

export const STEP_REVIEW = {
  propertyNameLabel: 'Property name',
  typeLabel: 'Type',
  managerLabel: 'Manager',
  accountantLabel: 'Accountant',
  buildingHeading: (n: number) => `Building ${n}`,
  unitLabel: (n: number) => `Unit ${n}`,
  sizeSuffix: 'm²',
  roomsSuffix: 'rooms',
  meaSuffix: 'MEA',
  backButton: '← Back',
  createButton: 'Create Property',
}

export const BUILDING_FORM = {
  buildingHeading: (n: number) => `Building ${n}`,
  removeBuildingButton: 'Remove building',
  address1Label: 'Address 1',
  address2Label: 'Address 2',
  addSecondAddressButton: '+ Add second address (corner building)',
  removeAddressButton: 'Remove',
  unitsLabel: 'Units',
  unitLabel: (n: number) => `Unit ${n}`,
  removeUnitButton: 'Remove',
  addUnitButton: '+ Add unit',
  numberLabel: 'Number',
  typeLabel: 'Type',
  typeSelectPlaceholder: 'Select',
  floorLabel: 'Floor',
  entranceLabel: 'Entrance',
  sizeLabel: 'Size (m²)',
  roomsLabel: 'Rooms',
  constructionYearLabel: 'Constr. year',
  coOwnershipShareLabel: 'Co-own. share',
  required: 'Required',
}

export const ADDRESS_AUTOCOMPLETE = {
  placeholder: 'e.g. Togostraße 75, Berlin',
  searching: 'Searching…',
  noHouseNumberHint: 'No house number found — add it after the street name (e.g. Togostraße 75)',
}

export const NEW_PROPERTY_PAGE = {
  manualTitle: 'Enter manually',
  manualDescription: 'Fill in the property details step by step.',
  importTitle: 'Import from PDF',
  importDescription: "Upload a property document and we'll extract what we can. You'll review and complete the rest.",
  partialImportMessage: "We couldn't extract all the details — review and complete the missing fields.",
}
