import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ChevronDown, Search } from 'lucide-react'
import { Breadcrumbs } from '@/components/shared/Breadcrumbs'
import { EmptyState } from '@/components/shared/EmptyState'
import { HelpCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Faq {
  question: string
  answer: string
}

interface FaqCategory {
  category: string
  faqs: Faq[]
}

const faqCategories: FaqCategory[] = [
  {
    category: 'Getting Started',
    faqs: [
      {
        question: 'Do I need to create an account to use the Central Registry e-Services?',
        answer:
          "You can track an application using just its reference number without an account. To apply for a Birth Certificate or National ID online and view your full application history, you'll need to register for a citizen account.",
      },
      {
        question: 'Is there a fee to use the online portal?',
        answer:
          'The portal itself is free to use. Official registration and document fees still apply as set out in the Resources → Fees section, and are payable through the channels confirmed at your registry office.',
      },
      {
        question: 'Can I apply from outside Zimbabwe?',
        answer:
          'Yes, the portal is accessible online from anywhere. However, some supporting documents or biometric steps may still require a visit to a Zimbabwean registry office, embassy, or diaspora centre — confirm this with your nearest office before applying.',
      },
    ],
  },
  {
    category: 'Birth Certificates',
    faqs: [
      {
        question: "What's the difference between new, late, and correction registration?",
        answer:
          'New registration applies to a birth that has not yet been registered. Late registration applies where the standard registration window has passed. Correction/replacement applies where a certificate already exists but contains an error, or has been lost or damaged.',
      },
      {
        question: 'What documents will I need?',
        answer:
          "Typically a hospital birth record and both parents' National IDs, though requirements vary by registration type. Use the Requirements Wizard on the homepage or the Resources → Requirements page to see what applies to your situation, and confirm with your registry office before applying.",
      },
      {
        question: 'How long does processing take?',
        answer:
          'Processing times vary by registration type and office workload. The homepage displays a typical processing window, and you can track your specific application at any time using its reference number.',
      },
    ],
  },
  {
    category: 'National ID',
    faqs: [
      {
        question: 'At what age can I apply for a National ID?',
        answer:
          'National ID applications are generally available from age 16. Confirm current age and eligibility requirements with your registry office, as these are set by legislation rather than by this portal.',
      },
      {
        question: 'What if I don\u2019t have my birth certificate details on hand?',
        answer:
          "You'll need the ID number printed on your birth certificate to complete the application, since it's used to verify your civil registration record. If you've lost your birth certificate, you may need to apply for a replacement first.",
      },
    ],
  },
  {
    category: 'Tracking & Application Status',
    faqs: [
      {
        question: 'I lost my reference number — can I still track my application?',
        answer:
          "The public tracking tool requires your reference number. If you've registered for an account and were signed in when you applied, you can also find your applications listed under My Applications in your dashboard.",
      },
      {
        question: 'What does "Additional Information Required" mean?',
        answer:
          "It means the Registrar's Office needs something further from you before your application can proceed — usually a missing document or a clarification. The reason is shown on the tracking page along with what to do next.",
      },
      {
        question: 'My application was rejected. What do I do next?',
        answer:
          'The tracking page will show the reason provided by the Registrar\u2019s Office where available. For most rejections, you can address the issue and submit a new application, or visit your nearest registry office for guidance.',
      },
    ],
  },
  {
    category: 'Account & Security',
    faqs: [
      {
        question: 'Is my personal information safe on this portal?',
        answer:
          'Sensitive identifiers such as National ID numbers are masked wherever they are displayed in your account. Document uploads are transmitted securely for processing. The Ministry, not this website, is responsible for how your data is stored and used once submitted.',
      },
      {
        question: 'How do I reset my password?',
        answer: 'Use the "Forgot your password?" link on the sign-in page to receive password reset instructions by email.',
      },
    ],
  },
]

export function FAQPage() {
  const [query, setQuery] = useState('')
  const [openKey, setOpenKey] = useState<string | null>(null)

  const filtered = faqCategories
    .map((cat) => ({
      ...cat,
      faqs: cat.faqs.filter(
        (f) =>
          f.question.toLowerCase().includes(query.toLowerCase()) ||
          f.answer.toLowerCase().includes(query.toLowerCase()),
      ),
    }))
    .filter((cat) => cat.faqs.length > 0)

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Resources', to: '/resources' }, { label: 'FAQs' }]} />
      <div className="container-gov max-w-3xl py-12">
        <h1 className="text-3xl font-bold text-charcoal-900">Frequently Asked Questions</h1>
        <p className="mt-3 text-sm text-slate-600">
          Answers to common questions about using the Central Registry e-Services portal. For anything not
          covered here, visit <Link to="/contact" className="font-semibold text-forest-700">Contact Us</Link> or
          your nearest <Link to="/offices" className="font-semibold text-forest-700">registry office</Link>.
        </p>

        <div className="relative mt-6">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search frequently asked questions…"
            className="w-full rounded-[var(--radius-control)] border border-slate-300 bg-white py-2.5 pl-9 pr-3 text-sm focus:border-forest-500 focus:outline-none focus:ring-2 focus:ring-forest-500/20"
          />
        </div>

        <div className="mt-8 flex flex-col gap-10">
          {filtered.length === 0 && (
            <EmptyState icon={HelpCircle} title="No matching questions" description="Try a different search term, or browse all categories below." />
          )}
          {filtered.map((cat) => (
            <div key={cat.category}>
              <h2 className="text-sm font-bold uppercase tracking-wide text-gold-600">{cat.category}</h2>
              <div className="mt-3 divide-y divide-slate-200 rounded-[var(--radius-card)] border border-slate-200 bg-white">
                {cat.faqs.map((faq) => {
                  const key = `${cat.category}__${faq.question}`
                  const isOpen = openKey === key
                  return (
                    <div key={key}>
                      <button
                        type="button"
                        onClick={() => setOpenKey(isOpen ? null : key)}
                        aria-expanded={isOpen}
                        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-charcoal-900"
                      >
                        {faq.question}
                        <ChevronDown className={cn('h-4 w-4 shrink-0 text-slate-400 transition-transform', isOpen && 'rotate-180')} aria-hidden="true" />
                      </button>
                      {isOpen && <p className="px-5 pb-4 text-sm leading-relaxed text-slate-600">{faq.answer}</p>}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
