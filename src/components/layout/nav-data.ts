export interface MegaMenuLink {
  label: string
  to: string
}

export interface MegaMenuSection {
  label: string
  links: MegaMenuLink[]
}

export const megaMenu: MegaMenuSection[] = [
  {
    label: 'Leadership & Governance',
    links: [
      { label: 'Ministry Leadership', to: '/leadership' },
      { label: 'Permanent Secretary', to: '/leadership' },
      { label: "Registrar General's Office", to: '/leadership' },
      { label: 'Ministry Mandate', to: '/about' },
      { label: 'Vision & Mission', to: '/about' },
      { label: 'Strategic Objectives', to: '/about' },
    ],
  },
  {
    label: 'Civil Registration & Services',
    links: [
      { label: 'Birth & Death Registration', to: '/services/birth-certificates' },
      { label: 'National Identity Documents', to: '/services/national-id' },
      { label: 'Passports & Travel Documents', to: '/services/passports' },
      { label: 'Marriage Certificates & Licensing', to: '/services/marriage-certificates' },
      { label: 'Citizenship & Renunciation', to: '/services/citizenship' },
    ],
  },
  {
    label: 'Departments',
    links: [
      { label: 'Civil Registration Department', to: '/departments/dep_1' },
      { label: 'Department of Immigration', to: '/departments/dep_2' },
      { label: 'National Archives of Zimbabwe', to: '/departments/dep_3' },
      { label: 'Forensic Science Laboratory', to: '/departments/dep_4' },
      { label: 'Zimbabwe Republic Police', to: '/departments/dep_5' },
      { label: 'Other Ministry Departments', to: '/departments' },
    ],
  },
  {
    label: 'Resources',
    links: [
      { label: 'Application Forms', to: '/resources/downloads' },
      { label: 'Requirements', to: '/resources/requirements' },
      { label: 'Fees', to: '/resources/fees' },
      { label: 'FAQs', to: '/resources/faqs' },
      { label: 'Acts & Legislation', to: '/resources/acts' },
      { label: 'Gazette Notices', to: '/resources/gazette-notices' },
      { label: 'Downloads', to: '/resources/downloads' },
    ],
  },
  {
    label: 'e-Services',
    links: [
      { label: 'Birth Certificate Application', to: '/e-services/birth-certificate/apply' },
      { label: 'National ID Application', to: '/e-services/national-id/apply' },
      { label: 'Application Status', to: '/track-application' },
      { label: 'Citizen Account', to: '/my-account' },
    ],
  },
  {
    label: 'Contact & Offices',
    links: [
      { label: 'Office Directory', to: '/offices' },
      { label: 'Provincial Offices', to: '/offices' },
      { label: 'District Offices', to: '/offices' },
      { label: 'Contact Us', to: '/contact' },
    ],
  },
]

export const primaryNav = [
  { label: 'Home', to: '/' as const },
  { label: 'About Us', to: '/about' as const },
  { label: 'Civil Registration', to: '/services' as const },
  { label: 'Departments', to: '/departments' as const },
  { label: 'Resources', to: '/resources' as const },
  { label: 'News & Notices', to: '/news' as const },
  { label: 'Contact', to: '/contact' as const },
]
