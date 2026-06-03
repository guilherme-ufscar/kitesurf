import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const LANGUAGES = [
  { code: 'pt', label: 'PT', flag: 'BR' },
  { code: 'en', label: 'EN', flag: 'US' },
  { code: 'es', label: 'ES', flag: 'ES' },
]

function FlagIcon({ country }: { country: string }) {
  const flags: Record<string, JSX.Element> = {
    BR: (
      <svg viewBox="0 0 20 14" className="w-5 h-3.5 rounded-sm">
        <rect width="20" height="14" fill="#009B3A" />
        <polygon points="10,1 19,7 10,13 1,7" fill="#FEDF00" />
        <circle cx="10" cy="7" r="3.2" fill="#002776" />
      </svg>
    ),
    US: (
      <svg viewBox="0 0 20 14" className="w-5 h-3.5 rounded-sm">
        <rect width="20" height="14" fill="#B22234" />
        {[0,2,4,6,8,10,12].map(y => (
          <rect key={y} y={y} width="20" height="1" fill="white" />
        ))}
        <rect width="8" height="7.5" fill="#3C3B6E" />
      </svg>
    ),
    ES: (
      <svg viewBox="0 0 20 14" className="w-5 h-3.5 rounded-sm">
        <rect width="20" height="14" fill="#AA151B" />
        <rect y="3" width="20" height="8" fill="#F1BF00" />
      </svg>
    ),
  }
  return flags[country] || null
}

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const current = LANGUAGES.find((l) => l.code === i18n.language) || LANGUAGES[0]

  const handleChange = (code: string) => {
    i18n.changeLanguage(code)
    localStorage.setItem('kite360_lang', code)
    setOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-steel-300 hover:text-white rounded-lg transition-colors text-sm font-medium"
      >
        <FlagIcon country={current.flag} />
        <span className="hidden sm:block">{current.label}</span>
        <ChevronDown size={12} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-lg border border-steel-100 py-1 z-50">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleChange(lang.code)}
              className={`flex items-center gap-2.5 w-full px-3 py-2 text-sm transition-colors ${
                lang.code === i18n.language
                  ? 'text-teal-700 bg-teal-50 font-semibold'
                  : 'text-navy-800 hover:bg-steel-50'
              }`}
            >
              <FlagIcon country={lang.flag} />
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
