import { PROPERTY_PAGES } from '@/domains/propertyCreation/constants/strings'

export const AutoSaveIndicator = () => (
  <div className="mt-10 pt-4 border-t border-gray-100 flex items-center gap-2 text-sm text-gray-500">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4 text-emerald-500 shrink-0"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
    <span>{PROPERTY_PAGES.autoSaved}</span>
  </div>
)
