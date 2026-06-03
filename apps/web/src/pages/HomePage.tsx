import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { Search, Wind, Waves, ChevronRight } from 'lucide-react'
import { api } from '@/lib/api'
import ListingCard from '@/components/ui/ListingCard'
import SEO from '@/components/SEO'

const CATEGORIES = [
  { slug: 'pipas', label: 'Pipas', icon: Wind },
  { slug: 'pranchas', label: 'Pranchas', icon: Waves },
  { slug: 'barras', label: 'Barras', icon: Wind },
  { slug: 'trapezios', label: 'Trapézios', icon: Wind },
  { slug: 'acessorios', label: 'Acessórios', icon: Wind },
  { slug: 'wingsuits', label: 'Wings', icon: Wind },
]

export default function HomePage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const { data: featured } = useQuery({
    queryKey: ['listings', 'featured'],
    queryFn: () => api.get('/search/featured').then((r) => r.data),
  })

  const { data: recent } = useQuery({
    queryKey: ['listings', 'recent'],
    queryFn: () => api.get('/search/recent').then((r) => r.data),
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    navigate(`/busca${query ? `?q=${encodeURIComponent(query)}` : ''}`)
  }

  return (
    <div>
      <SEO
        title="KITE360º — Marketplace de Kitesurf e Equipamentos Aquáticos"
        description="Compre e venda equipamentos de kitesurf, wingfoil, kitefoil e kitewave. Marketplace seguro para a comunidade brasileira de esportes aquáticos."
      />

      {/* Hero */}
      <section className="relative bg-navy-900 overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 30% 50%, #286B72 0%, transparent 60%), radial-gradient(circle at 70% 20%, #286B72 0%, transparent 50%)',
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <div className="max-w-2xl">
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-white leading-tight mb-4">
              {t('home.hero.title')}
              <span className="block text-teal-400">kite360.com.br</span>
            </h1>
            <p className="text-steel-300 text-lg mb-8 leading-relaxed">
              {t('home.hero.subtitle')}
            </p>

            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-steel-400" size={18} />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t('home.hero.searchPlaceholder')}
                  className="input pl-10 bg-white/10 border-white/20 text-white placeholder:text-steel-400 focus:bg-white/15"
                />
              </div>
              <button type="submit" className="btn-primary shrink-0">
                {t('home.hero.search')}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-navy-900 text-lg">{t('home.categories')}</h2>
          <button
            onClick={() => navigate('/busca')}
            className="flex items-center gap-1 text-teal-600 hover:text-teal-700 text-sm font-medium"
          >
            Ver tudo <ChevronRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {CATEGORIES.map(({ slug, label, icon: Icon }) => (
            <button
              key={slug}
              onClick={() => navigate(`/busca?category=${slug}`)}
              className="card p-3 flex flex-col items-center gap-2 hover:border-teal-300 hover:shadow-md transition-all duration-200 text-center"
            >
              <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center">
                <Icon size={20} className="text-teal-600" />
              </div>
              <span className="text-xs font-medium text-navy-700">{label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Featured listings */}
      {featured?.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-bold text-navy-900 text-xl">{t('home.hero.featured')}</h2>
            <button
              onClick={() => navigate('/busca?featured=true')}
              className="flex items-center gap-1 text-teal-600 hover:text-teal-700 text-sm font-medium"
            >
              Ver todos <ChevronRight size={14} />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {featured.map((listing: any) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </section>
      )}

      {/* Recent listings */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-16">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-bold text-navy-900 text-xl">{t('home.hero.recent')}</h2>
          <button
            onClick={() => navigate('/busca')}
            className="flex items-center gap-1 text-teal-600 hover:text-teal-700 text-sm font-medium"
          >
            Ver todos <ChevronRight size={14} />
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {recent?.map((listing: any) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
          {!recent?.length && (
            <div className="col-span-full text-center py-16 text-steel-400">
              <Wind size={40} className="mx-auto mb-3 text-steel-300" />
              <p>Nenhum anúncio publicado ainda. Seja o primeiro!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
