import { useCallback, useEffect } from 'react'

// Google Translate API (camouflaged - no UI elements shown)
const googleTranslate = (text: string, targetLang: string): Promise<string> => {
  return new Promise((resolve) => {
    const langMap: Record<string, string> = {
      'pt': 'pt',
      'en': 'en',
      'es': 'es',
    }
    const glLang = langMap[targetLang] || 'pt'

    if (!window.google?.translate) {
      resolve(text)
      return
    }

    try {
      const translateElement = new (window.google as any).translate.TranslateElement(
        {
          pageLanguage: 'pt',
          includedLanguages: 'pt,en,es',
          layout: (window.google as any).translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        'google_translate_element'
      )

      // Use internal translation method
      const gtService = (translateElement as any).getEl()

      if (gtService && typeof gtService.getTranslatedText === 'function') {
        const result = gtService.getTranslatedText(text)
        resolve(result || text)
      } else {
        // Fallback - return original text if translation service not ready
        resolve(text)
      }
    } catch {
      resolve(text)
    }
  })
}

// Hook for translating content dynamically
export function useTranslate() {
  const translate = useCallback(async (text: string, targetLang: string): Promise<string> => {
    if (!text || targetLang === 'pt') return text

    try {
      // Try Google Translate API
      return await googleTranslate(text, targetLang)
    } catch {
      return text
    }
  }, [])

  return { translate }
}

// Component to initialize Google Translate (invisible)
export function GoogleTranslateInit() {
  useEffect(() => {
    // Check if already loaded
    if (window.google?.translate) return

    const script = document.createElement('script')
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
    script.async = true
    document.head.appendChild(script)
  }, [])

  return <div id="google_translate_element" style={{ display: 'none' }} />
}

// Export for direct translation usage
export const translateText = async (text: string, targetLang: string): Promise<string> => {
  return googleTranslate(text, targetLang)
}