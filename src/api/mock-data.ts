import type {
  Office,
  Department,
  NewsArticle,
  Resource,
  Citizen,
} from '@/types'

// ---------------------------------------------------------------------------
// This file stands in for a backend database during frontend development.
// Nothing here should be imported by presentation components directly —
// only by the *.api.ts modules, which is what makes swapping in a real
// backend later a contained, low-risk change.
// ---------------------------------------------------------------------------

export const mockCitizen: Citizen = {
  id: 'cit_001',
  firstName: 'Tinashe',
  surname: 'Moyo',
  nationalIdNumber: '63-XXXXXXX-X-XX',
  email: 'tinashe.moyo@example.com',
  phone: '+263 77 123 4567',
  phoneVerified: true,
}

export const mockOffices: Office[] = [
  { id: 'off_1', name: 'Harare Central Registry Office', province: 'Harare', district: 'Harare Central', address: 'Corner Simon Muzenda St & Nelson Mandela Ave, Harare', phone: '[Official Ministry Contact Number]', hours: 'Mon–Fri, 8:00 AM – 4:00 PM', services: ['Birth Registration', 'National ID', 'Passports'], biometricEnrollment: true, lat: -17.831, lng: 31.045 },
  { id: 'off_2', name: 'Bulawayo Registry Office', province: 'Bulawayo', district: 'Bulawayo Central', address: 'Fife Street, Bulawayo', phone: '[Official Ministry Contact Number]', hours: 'Mon–Fri, 8:00 AM – 4:00 PM', services: ['Birth Registration', 'National ID'], biometricEnrollment: true, lat: -20.15, lng: 28.583 },
  { id: 'off_3', name: 'Mutare District Registry Office', province: 'Manicaland', district: 'Mutare', address: 'Herbert Chitepo Street, Mutare', phone: '[Official Ministry Contact Number]', hours: 'Mon–Fri, 8:00 AM – 4:00 PM', services: ['Birth Registration', 'Death Registration'], biometricEnrollment: false, lat: -18.973, lng: 32.673 },
  { id: 'off_4', name: 'Gweru Registry Office', province: 'Midlands', district: 'Gweru', address: 'Main Street, Gweru', phone: '[Official Ministry Contact Number]', hours: 'Mon–Fri, 8:00 AM – 4:00 PM', services: ['Birth Registration', 'National ID'], biometricEnrollment: true, lat: -19.45, lng: 29.82 },
  { id: 'off_5', name: 'Masvingo Registry Office', province: 'Masvingo', district: 'Masvingo', address: 'Robert Mugabe Street, Masvingo', phone: '[Official Ministry Contact Number]', hours: 'Mon–Fri, 8:00 AM – 4:00 PM', services: ['Birth Registration'], biometricEnrollment: false, lat: -20.07, lng: 30.83 },
]

export const mockDepartments: Department[] = [
  {
    id: 'dep_1',
    name: 'Civil Registration Department',
    description: 'Administers birth, death and marriage registration across Zimbabwe.',
    about:
      "The Civil Registration Department, commonly known as the Central Registry, is the legal authority responsible for registering births, deaths, marriages, citizenship and livestock brands, and for issuing the identity and travel documents that flow from them — including birth and death certificates, National IDs, and passports. It operates through provincial and district registry offices across all ten provinces, and its records underpin nearly every other legal identity document a Zimbabwean citizen holds.",
  },
  {
    id: 'dep_2',
    name: 'Department of Immigration',
    description: 'Manages entry, residence and citizenship-related border control matters.',
    about:
      'The Department of Immigration administers the Immigration Act [Chapter 4:02] on behalf of the Ministry, controlling and facilitating the movement of people into and out of Zimbabwe. It operates border posts, town and airport offices, and issues visas, permits and residence documents to travellers, immigrants and returning residents. Visa applications can also be lodged online through the e-Visa platform.',
    website: 'https://www.zimimmigration.gov.zw/',
  },
  {
    id: 'dep_3',
    name: 'National Archives of Zimbabwe',
    description: 'Preserves the national documentary heritage and public records.',
    about:
      "The National Archives of Zimbabwe (NAZ) is the country's official custodian of historical and legal documentation. Established in 1935 and governed by the National Archives Act [Chapter 25:06 of 1986], NAZ acquires, preserves and provides public access to government and private records of national significance — including historical manuscripts, oral history recordings, and audio-visual heritage material dating back to the 1890s.",
    website: 'https://www.archives.gov.zw/',
  },
  {
    id: 'dep_4',
    name: 'Forensic Science Laboratory',
    description: 'Provides forensic analysis in support of civil and criminal matters.',
    about:
      "The Forensic Science function supports criminal investigations and the administration of justice by examining physical evidence — such as biological samples, ballistics, toxicology and questioned documents — to produce expert findings used in court. [Detailed, department-specific information on its current structure and services should be confirmed directly with the Ministry, as little is published independently of related police forensic units.]",
  },
  {
    id: 'dep_5',
    name: 'Zimbabwe Republic Police',
    description: 'Responsible for national law enforcement and public safety.',
    about:
      'The Zimbabwe Republic Police (ZRP) is the national police service, established under Section 219 of the Constitution of Zimbabwe. Its mandate is to preserve the internal security of Zimbabwe, protect the lives and property of the people, maintain law and order, and prevent, investigate and detect crime. It is organised into Administration, Operations, and Crime and Human Resources divisions across the country\u2019s police provinces, with specialised units covering areas such as Criminal Investigations, Forensics & Ballistics, and community policing programmes.',
    website: 'https://zrp.gov.zw/',
  },
  {
    id: 'dep_6',
    name: 'Finance',
    description: 'Manages the Ministry\u2019s financial planning and accountability.',
    about:
      "The Finance department manages the Ministry's budgeting, expenditure control and financial reporting, ensuring public funds allocated to the Ministry's programmes — including civil registration services — are accounted for transparently and in line with government financial regulations.",
  },
  {
    id: 'dep_7',
    name: 'Human Resources',
    description: 'Oversees staffing, training and welfare across the Ministry.',
    about:
      "The Human Resources department manages staffing, recruitment, training and performance management, and staff welfare across the Ministry's departments, supporting the workforce that delivers civil registration, immigration, policing and cultural heritage services nationwide.",
  },
  {
    id: 'dep_8',
    name: 'ICT',
    description: 'Maintains the Ministry\u2019s information systems and digital services.',
    about:
      "The Information and Communication Technology department maintains the Ministry's information systems, networks and digital infrastructure, including the systems that support civil registration record-keeping and, increasingly, online citizen-facing services.",
  },
  {
    id: 'dep_9',
    name: 'Legal',
    description: 'Provides legal advisory services across Ministry operations.',
    about:
      "The Legal department provides legal advisory services across the Ministry's operations, including guidance on the legislation that governs civil registration, immigration and policing, such as the Births and Deaths Registration Act and the Immigration Act.",
  },
  {
    id: 'dep_10',
    name: 'Internal Audit',
    description: 'Reviews internal controls and operational compliance.',
    about:
      "The Internal Audit department reviews the Ministry's internal controls, financial processes and operational compliance, helping to safeguard public resources and improve the effectiveness of service delivery across departments.",
  },
  {
    id: 'dep_11',
    name: 'Procurement',
    description: 'Manages the Ministry\u2019s procurement of goods and services.',
    about:
      "The Procurement Management Unit manages the Ministry's procurement of goods, services and works in line with Zimbabwe's public procurement laws, aiming for transparent and competitive sourcing across the Ministry's operations.",
  },
  {
    id: 'dep_12',
    name: 'Strategic Policy Planning',
    description: 'Coordinates policy development and strategic planning.',
    about:
      "The Strategic Policy Planning, Monitoring and Evaluation department coordinates the Ministry's strategic planning processes, tracks performance against the Ministry's objectives, and helps align the Ministry's programmes with national development priorities.",
  },
]

export const mockNews: NewsArticle[] = [
  { id: 'news_1', slug: 'official-channels-notice', category: 'Public Notice', title: 'Use Only Official Ministry Channels', summary: 'Citizens are advised to use only official Ministry channels when applying for civil registration documents.', date: '2026-07-22', urgent: true, image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=600&q=60' },
  { id: 'news_2', slug: 'mobile-registration-drive', category: 'Registration Drive', title: 'Mobile Birth Registration Drive — Mashonaland', summary: 'Outreach teams will visit selected wards to assist with late birth registrations.', date: '2026-07-18', image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=60' },
  { id: 'news_3', slug: 'portal-maintenance-window', category: 'System Maintenance', title: 'Scheduled e-Services Maintenance', summary: 'The Central Registry e-Services portal will undergo scheduled maintenance overnight.', date: '2026-07-15', image: 'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=600&q=60' },
  { id: 'news_4', slug: 'fee-schedule-update', category: 'Fee Update', title: 'Updated Fee Schedule Notice', summary: 'An updated schedule of fees for civil registration services will take effect next quarter.', date: '2026-07-10', image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=600&q=60' },
]

export const mockResources: Resource[] = [
  { id: 'res_1', title: 'Birth Registration Application Form (Form BR1)', category: 'Application Forms', fileType: 'PDF', date: '2026-01-10' },
  { id: 'res_2', title: 'National ID Application Requirements', category: 'Requirements', fileType: 'PDF', date: '2026-02-02' },
  { id: 'res_3', title: 'Schedule of Fees — Civil Registration Services', category: 'Fees', fileType: 'PDF', date: '2026-03-15' },
  { id: 'res_3b', title: 'National ID Application Fees', category: 'Fees', fileType: 'PDF', date: '2026-03-15' },
  { id: 'res_3c', title: 'Late Birth Registration Penalty Fees', category: 'Fees', fileType: 'PDF', date: '2026-03-15' },
  { id: 'res_4', title: 'Births and Deaths Registration Act [Chapter 5:02]', category: 'Acts & Regulations', fileType: 'PDF', date: '2025-11-01' },
  { id: 'res_4b', title: 'Immigration Act [Chapter 4:02]', category: 'Acts & Regulations', fileType: 'PDF', date: '2025-11-01' },
  { id: 'res_4c', title: 'National Archives Act [Chapter 25:06]', category: 'Acts & Regulations', fileType: 'PDF', date: '2025-11-01' },
  { id: 'res_5', title: 'Frequently Asked Questions — Central Registry', category: 'FAQs', fileType: 'DOCX', date: '2026-04-05' },
  { id: 'res_6', title: 'Gazette Notice — Amendment to Registration Fees', category: 'Gazette Notices', fileType: 'PDF', date: '2026-05-12' },
  { id: 'res_7', title: 'Gazette Notice — Designation of Additional Registry Offices', category: 'Gazette Notices', fileType: 'PDF', date: '2026-02-20' },
]
