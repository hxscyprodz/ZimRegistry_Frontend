import { Clock, Mail, Globe } from 'lucide-react'
import { useUiStore, type Language } from '@/stores/uiStore'

const languages: { code: Language; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'sn', label: 'Shona' },
  { code: 'nd', label: 'Ndebele' },
]

export function UtilityBar() {
  const language = useUiStore((s) => s.language)
  const setLanguage = useUiStore((s) => s.setLanguage)

  return (
    <div className="hidden bg-ebony-950 text-white/80 md:block">
      <div className="container-gov flex items-center justify-between py-2 text-xs">
        <div className="flex items-center gap-5">
          <span className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-gold-400" aria-hidden="true" />
            Monday – Friday | 8:00 AM – 4:00 PM
          </span>
          <span className="flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5 text-gold-400" aria-hidden="true" />
            Need assistance?{' '}
            <a href="/contact" className="underline decoration-white/30 underline-offset-2 hover:text-white">
              Contact Support
            </a>
          </span>
        </div>
        <div className="flex items-center gap-1.5" role="group" aria-label="Language">
          <Globe className="h-3.5 w-3.5 text-gold-400" aria-hidden="true" />
          {languages.map((lang, i) => (
            <span key={lang.code} className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setLanguage(lang.code)}
                aria-pressed={language === lang.code}
                className={language === lang.code ? 'font-semibold text-gold-400' : 'hover:text-white'}
              >
                {lang.label}
              </button>
              {i < languages.length - 1 && <span aria-hidden="true">|</span>}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
