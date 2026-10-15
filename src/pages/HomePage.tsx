import { Link } from '@tanstack/react-router'
import {
  FileText,
  IdCard,
  Search,
  MapPin,
  ClipboardList,
  Download,
  Baby,
  Skull,
  Plane,
  Heart,
  Landmark,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ServiceCard } from '@/components/shared/ServiceCard'
import { StatCard } from '@/components/shared/StatCard'
import { NewsCard } from '@/components/shared/NewsCard'
import { PublicNotice } from '@/components/shared/PublicNotice'
import { ResourceCard } from '@/components/shared/ResourceCard'
import { RequirementsWizard } from '@/components/shared/RequirementsWizard'
import { NewsletterSignup } from '@/components/shared/NewsletterSignup'
import { CardSkeleton } from '@/components/shared/LoadingSkeleton'
import { Reveal } from '@/components/shared/Reveal'
import { CountUp } from '@/components/shared/CountUp'
import { useServiceStats, useDepartments, useNews, useResources } from '@/hooks/usePublicContent'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

const quickActions = [
  { icon: FileText, title: 'Apply for Birth Certificate', description: 'Start a birth certificate registration application online.', to: '/e-services/birth-certificate/apply', ctaLabel: 'Start Application', badge: 'Available Online' },
  { icon: IdCard, title: 'Apply for National ID', description: 'Submit your National ID application details.', to: '/e-services/national-id/apply', ctaLabel: 'Apply Now', badge: 'Available Online' },
  { icon: Search, title: 'Track Application', description: 'Check the status of an existing application.', to: '/track-application', ctaLabel: 'Track Application', badge: 'Available Online' },
  { icon: MapPin, title: 'Find an Office', description: 'Locate a Central Registry office and available services.', to: '/offices', ctaLabel: 'Find an Office' },
  { icon: ClipboardList, title: 'Requirements & Fees', description: 'Understand what documents and information are required.', to: '/resources/requirements', ctaLabel: 'View Requirements' },
  { icon: Download, title: 'Download Forms', description: 'Access official government application forms and documents.', to: '/resources/downloads', ctaLabel: 'Browse Downloads' },
]

const civilServices = [
  { icon: Baby, title: 'Birth Certificates', description: 'Register a birth and apply for a certified birth certificate.', to: '/services/birth-certificates', ctaLabel: 'Learn More', prominent: true, badge: 'Available Online', image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=600&q=60' },
  { icon: IdCard, title: 'National ID', description: 'Apply for or renew your national identity document.', to: '/services/national-id', ctaLabel: 'Learn More', prominent: true, badge: 'Available Online', image: 'https://images.unsplash.com/photo-1622675363311-3e1904dc1885?auto=format&fit=crop&w=600&q=60' },
  { icon: Skull, title: 'Death Certificates', description: 'Register a death and request an official death certificate.', to: '/services/death-certificates', ctaLabel: 'Learn More', image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=600&q=60' },
  { icon: Plane, title: 'Passports', description: 'Information on travel document applications and renewals.', to: '/services/passports', ctaLabel: 'Learn More', image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=60' },
  { icon: Heart, title: 'Marriage Certificates', description: 'Marriage registration and licensing information.', to: '/services/marriage-certificates', ctaLabel: 'Learn More', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=60' },
  { icon: Landmark, title: 'Citizenship Services', description: 'Citizenship and renunciation service information.', to: '/services/citizenship', ctaLabel: 'Learn More', image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=600&q=60' },
]

const heroImages = [
  'https://images.unsplash.com/photo-1523805009345-7448845a9e53?auto=format&fit=crop&w=1600&q=60',
  'https://images.unsplash.com/photo-1541480601022-2308c0f02487?auto=format&fit=crop&w=1600&q=60',
  'https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=1600&q=60',
]

export function HomePage() {
  const stats = useServiceStats()
  const departments = useDepartments()
  const news = useNews()
  const resources = useResources()
  const [heroIndex, setHeroIndex] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const interval = window.setInterval(() => {
      setHeroIndex((i) => (i + 1) % heroImages.length)
    }, 6000)
    return () => window.clearInterval(interval)
  }, [])

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-forest-800">
        {heroImages.map((src, i) => (
          <div
            key={src}
            className="absolute inset-0 bg-cover bg-center opacity-25 transition-opacity duration-1000 ease-in-out"
            style={{ backgroundImage: `url('${src}')`, opacity: i === heroIndex ? 0.25 : 0 }}
            aria-hidden="true"
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-forest-900/60 via-forest-800/80 to-forest-900" aria-hidden="true" />
        <div className="container-gov relative py-20 sm:py-28">
          <p className="text-sm font-semibold uppercase tracking-widest text-gold-400">Republic of Zimbabwe</p>
          <h1 className="mt-4 max-w-2xl font-display text-3xl font-bold leading-tight text-white sm:text-5xl">
            Serving Citizens. Strengthening National Identity.
          </h1>
          <p className="mt-5 max-w-xl text-base text-white/80 sm:text-lg">
            Access trusted civil registration services, information and digital applications from the Ministry of
            Home Affairs and Cultural Heritage.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/e-services">
              <Button variant="gold" size="lg">Access e-Services</Button>
            </Link>
            <Link to="/services">
              <Button variant="outline" size="lg">Explore Services</Button>
            </Link>
          </div>
          <div className="mt-10 flex gap-2" role="tablist" aria-label="Hero background image">
            {heroImages.map((src, i) => (
              <button
                key={src}
                type="button"
                role="tab"
                aria-selected={i === heroIndex}
                aria-label={`Show hero image ${i + 1}`}
                onClick={() => setHeroIndex(i)}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-300',
                  i === heroIndex ? 'w-8 bg-gold-400' : 'w-4 bg-white/30 hover:bg-white/50',
                )}
              />
            ))}
          </div>
        </div>
      </section>

      {/* QUICK CITIZEN ACTIONS */}
      <section className="relative z-10 -mt-10 pb-4">
        <div className="container-gov">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {quickActions.map((action, i) => (
              <Reveal key={action.title} delayMs={i * 60}>
                <ServiceCard {...action} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CIVIL REGISTRATION SERVICES */}
      <section className="py-16">
        <div className="container-gov">
          <Reveal>
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-wide text-gold-600">Civil Registration Services</p>
              <h2 className="mt-2 text-2xl font-bold text-charcoal-900 sm:text-3xl">
                Access essential civil registration services from one secure digital platform.
              </h2>
            </div>
          </Reveal>
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {civilServices.map((s, i) => (
              <Reveal key={s.title} delayMs={i * 60}>
                <ServiceCard {...s} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-forest-900 py-14">
        <div className="container-gov grid grid-cols-2 gap-8 sm:grid-cols-4">
          {stats.isLoading || !stats.data ? (
            <p className="col-span-2 text-sm text-white/60 sm:col-span-4">Loading service statistics…</p>
          ) : (
            <>
              <StatCard value={<CountUp value={stats.data.applicationsReceived.toLocaleString()} />} label="Applications Received" />
              <StatCard value={<CountUp value={stats.data.applicationsProcessed.toLocaleString()} />} label="Applications Processed" />
              <StatCard value={<CountUp value={String(stats.data.activeCentres)} />} label="Active Registration Centres" />
              <StatCard value={stats.data.typicalProcessingWindow} label="Typical Processing Window" />
            </>
          )}
        </div>
      </section>

      {/* ABOUT */}
      <section className="py-16">
        <div className="container-gov grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <img
              src="https://images.unsplash.com/photo-1541480601022-2308c0f02487?auto=format&fit=crop&w=1000&q=60"
              alt="Government administrative building"
              className="h-72 w-full rounded-[var(--radius-card)] object-cover shadow-md sm:h-96"
            />
          </Reveal>
          <Reveal delayMs={120}>
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-gold-600">About the Ministry</p>
              <h2 className="mt-2 text-2xl font-bold text-charcoal-900 sm:text-3xl">
                Upholding national identity and civil registration for every Zimbabwean
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-600">
                The Ministry of Home Affairs and Cultural Heritage is mandated to administer civil registration,
                national identity, immigration and cultural heritage matters on behalf of the Government of Zimbabwe,
                through the Registrar General's Office and the Central Registry.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Our mission is to promote a secure and peaceful environment through maintaining law and order,
                managing migration, and the timely registration and issuance of secure identification documents —
                while preserving Zimbabwe's national heritage and historic documents for generations to come.
              </p>
              <Link to="/about" className="mt-5 inline-block">
                <Button variant="secondary">Learn More</Button>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* DEPARTMENTS */}
      <section className="bg-surface-slate py-16">
        <div className="container-gov">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-wide text-gold-600">Departments</p>
            <h2 className="mt-2 text-2xl font-bold text-charcoal-900 sm:text-3xl">Ministry Departments</h2>
          </Reveal>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {departments.isLoading &&
              Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
            {departments.data?.slice(0, 6).map((dep, i) => (
              <Reveal key={dep.id} delayMs={i * 50}>
                <div className="card-gov p-5">
                  <h3 className="text-base font-semibold text-charcoal-900">{dep.name}</h3>
                  <p className="mt-1.5 text-sm text-slate-500">{dep.description}</p>
                  <Link
                    to="/departments/$departmentId"
                    params={{ departmentId: dep.id }}
                    className="mt-3 inline-block text-sm font-semibold text-forest-700"
                  >
                    Learn More →
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
          <Link to="/departments" className="mt-6 inline-block text-sm font-semibold text-forest-700">
            View All Departments →
          </Link>
        </div>
      </section>

      {/* REQUIREMENTS WIZARD */}
      <section className="py-16">
        <div className="container-gov grid grid-cols-1 gap-10 lg:grid-cols-2">
          <Reveal>
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-gold-600">Document Requirements</p>
              <h2 className="mt-2 text-2xl font-bold text-charcoal-900 sm:text-3xl">What do I need to bring?</h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-600">
                Answer two quick questions and we'll show you what to prepare before visiting an office or applying
                online.
              </p>
            </div>
          </Reveal>
          <Reveal delayMs={120}>
            <RequirementsWizard />
          </Reveal>
        </div>
      </section>

      {/* NEWS & NOTICES */}
      <section className="bg-surface-slate py-16">
        <div className="container-gov">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-wide text-gold-600">Latest News &amp; Public Notices</p>
            <h2 className="mt-2 text-2xl font-bold text-charcoal-900 sm:text-3xl">News &amp; Notices</h2>
          </Reveal>

          {news.data?.find((n) => n.urgent) && (
            <Reveal delayMs={80}>
              <div className="mt-6">
                <PublicNotice to={`/news/${news.data.find((n) => n.urgent)!.slug}`}>
                  {news.data.find((n) => n.urgent)!.summary}
                </PublicNotice>
              </div>
            </Reveal>
          )}

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {news.isLoading && Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}
            {news.data?.slice(0, 3).map((article, i) => (
              <Reveal key={article.id} delayMs={i * 60}>
                <NewsCard article={article} />
              </Reveal>
            ))}
          </div>
          <Link to="/news" className="mt-6 inline-block text-sm font-semibold text-forest-700">
            View All News &amp; Notices →
          </Link>
        </div>
      </section>

      {/* RESOURCES */}
      <section className="py-16">
        <div className="container-gov">
          <Reveal>
            <p className="text-sm font-bold uppercase tracking-wide text-gold-600">Resources &amp; Downloads</p>
            <h2 className="mt-2 text-2xl font-bold text-charcoal-900 sm:text-3xl">Forms, Guides &amp; Legislation</h2>
          </Reveal>
          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {resources.isLoading && Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
            {resources.data?.slice(0, 4).map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
          <Link to="/resources" className="mt-6 inline-block text-sm font-semibold text-forest-700">
            Browse All Resources →
          </Link>
        </div>
      </section>

      {/* NEWSLETTER SIGNUP */}
      <section className="bg-surface-slate py-16">
        <div className="container-gov">
          <Reveal>
            <NewsletterSignup />
          </Reveal>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-forest-700 py-16">
        <div className="container-gov flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">Access Central Registry e-Services</h2>
            <p className="mt-2 max-w-lg text-sm text-white/75">
              Apply for civil registration documents, track existing applications, and manage everything from your
              citizen account.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link to="/e-services">
              <Button variant="gold" size="lg">Apply Now</Button>
            </Link>
            <Link to="/track-application">
              <Button variant="outline" size="lg">Track Application</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
