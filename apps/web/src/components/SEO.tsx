import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

interface SEOProps {
  title?: string
  description?: string
  image?: string
  type?: 'website' | 'product' | 'profile'
  locale?: string
}

const DEFAULT_TITLE = 'KITE360º — Marketplace de Kitesurf, Wingfoil e Equipamentos Aquáticos'
const DEFAULT_DESCRIPTION = 'Compre e venda equipamentos de kitesurf, wingfoil, kitefoil e kitewave. Marketplace seguro para a comunidade brasileira de esportes aquáticos.'
const DEFAULT_IMAGE = '/og-image.jpg'

export default function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_IMAGE,
  type = 'website',
  locale = 'pt_BR',
}: SEOProps) {
  const { t } = useTranslation()
  const location = useLocation()
  const fullUrl = `https://kite360.com.br${location.pathname}`

  return (
    <Helmet>
      {/* Basic */}
      <title>{title ? `${title} | KITE360º` : DEFAULT_TITLE}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title || DEFAULT_TITLE} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:locale" content={locale} />
      <meta property="og:site_name" content="KITE360º" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title || DEFAULT_TITLE} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Additional */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="KITE360º" />
      <meta name="theme-color" content="#141F2E" />

      {/* Schema.org structured data */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': type === 'product' ? 'Product' : 'WebSite',
          name: title || 'KITE360º',
          description,
          url: fullUrl,
          ...(type === 'product' && {
            offers: {
              '@type': 'Offer',
              priceCurrency: 'BRL',
            },
          }),
          publisher: {
            '@type': 'Organization',
            name: 'KITE360º',
            logo: {
              '@type': 'ImageObject',
              url: 'https://kite360.com.br/logo.svg',
            },
          },
        })}
      </script>
    </Helmet>
  )
}