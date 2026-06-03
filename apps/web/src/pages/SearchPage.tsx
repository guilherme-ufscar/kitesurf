import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { api } from '@/lib/api'
import ListingCard from '@/components/ui/ListingCard'
import { Condition, Modality } from '@kite360/shared'

export default function SearchPage() {
  const { t } = useTranslation()
  const [params, setParams] = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)

  const filters = {
    q: params.get('q') || '',
    modality: params.get('modality') || '',
    condition: params.get('condition') || '',
    minPrice: params.get('minPrice') || '',
    maxPrice: params.get('maxPrice') || '',
    state: params.get('state') || '',
    page: Number(params.get('page') || 1),
  }

  const { data, isLoading } = useQuery({
    queryKey: ['search', filters],
    queryFn: () => {
      const p = new URLSearchParams()
      Object.entries(filters).forEach(([k, v]) => { if (v) p.set(k, String(v)) })
      return api.get(`/search?${p}`).then((r) => r.data)
    },
  })

  const updateFilter = (key: string, value: string) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    next.delete('page')
    setParams(next)
  }

  const clearFilters = () => setParams(new URLSearchParams())

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Search bar */}
      <div className="flex gap-2 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-steel-400" size={18} />
          <input
            value={filters.q}
            onChange={(e) => updateFilter('q', e.target.value)}
            placeholder={t('home.hero.searchPlaceholder')}
            className="input pl-10"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="btn-secondary flex items-center gap-2"
        >
          <SlidersHorizontal size={16} />
          <span className="hidden sm:block">{t('search.filters')}</span>
        </button>
      </div>

      <div className="flex gap-6">
        {/* Filters sidebar */}
        {showFilters && (
          <aside className="w-60 shrink-0">
            <div className="card p-4 space-y-5 sticky top-20">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-navy-800">{t('search.filters')}</h3>
                <button onClick={clearFilters} className="text-xs text-steel-500 hover:text-red-500 flex items-center gap-1">
                  <X size={12} /> {t('search.clearFilters')}
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-steel-500 uppercase tracking-wide mb-2">
                  {t('search.modality')}
                </label>
                <select
                  value={filters.modality}
                  onChange={(e) => updateFilter('modality', e.target.value)}
                  className="input text-sm"
                >
                  <option value="">Todas</option>
                  {Object.values(Modality).map((m) => (
                    <option key={m} value={m}>{t(`listing.modality.${m}`)}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-steel-500 uppercase tracking-wide mb-2">
                  {t('search.condition')}
                </label>
                <select
                  value={filters.condition}
                  onChange={(e) => updateFilter('condition', e.target.value)}
                  className="input text-sm"
                >
                  <option value="">Todas</option>
                  {Object.values(Condition).map((c) => (
                    <option key={c} value={c}>{t(`listing.condition.${c}`)}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-steel-500 uppercase tracking-wide mb-2">
                  {t('search.priceRange')}
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) => updateFilter('minPrice', e.target.value)}
                    placeholder="Mín"
                    className="input text-sm w-full"
                  />
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) => updateFilter('maxPrice', e.target.value)}
                    placeholder="Máx"
                    className="input text-sm w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-steel-500 uppercase tracking-wide mb-2">
                  Estado
                </label>
                <input
                  value={filters.state}
                  onChange={(e) => updateFilter('state', e.target.value)}
                  placeholder="Ex: CE, SP..."
                  className="input text-sm"
                  maxLength={2}
                />
              </div>
            </div>
          </aside>
        )}

        {/* Results */}
        <div className="flex-1 min-w-0">
          {data && (
            <p className="text-sm text-steel-500 mb-4">
              {data.total} {t('search.results')}
            </p>
          )}

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="card aspect-[3/4] animate-pulse bg-steel-100" />
              ))}
            </div>
          ) : data?.data?.length ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {data.data.map((listing: any) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>

              {data.totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => updateFilter('page', String(p))}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                        p === filters.page
                          ? 'bg-teal-600 text-white'
                          : 'bg-white text-navy-700 hover:bg-steel-50 border border-steel-200'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 text-steel-400">
              <Search size={40} className="mx-auto mb-3 text-steel-300" />
              <p className="font-medium">{t('search.noResults')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
