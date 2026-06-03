import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Plus, Eye, Pencil, Trash2, PauseCircle, PlayCircle } from 'lucide-react'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'
import { formatCurrency, formatRelativeDate } from '@/lib/utils'

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user)

  const { data: listings, isLoading } = useQuery({
    queryKey: ['my-listings'],
    queryFn: () => api.get('/listings/my').then((r) => r.data),
  })

  const statusColor: Record<string, string> = {
    ACTIVE: 'text-green-600 bg-green-50',
    DRAFT: 'text-steel-500 bg-steel-100',
    PAUSED: 'text-yellow-600 bg-yellow-50',
    SOLD: 'text-teal-600 bg-teal-50',
    EXPIRED: 'text-red-500 bg-red-50',
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy-900">Meus Anúncios</h1>
          <p className="text-steel-500 text-sm">Olá, {user?.name}</p>
        </div>
        <Link to="/anunciar" className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Novo Anúncio
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-4 animate-pulse h-20 bg-steel-100" />
          ))}
        </div>
      ) : listings?.length ? (
        <div className="space-y-3">
          {listings.map((listing: any) => (
            <div key={listing.id} className="card p-4 flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-steel-100 overflow-hidden shrink-0">
                {listing.images?.[0]?.media?.thumbUrl ? (
                  <img src={listing.images[0].media.thumbUrl} alt="" className="w-full h-full object-cover" />
                ) : null}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-navy-800 truncate">{listing.title}</p>
                <p className="text-teal-600 font-bold text-sm">{formatCurrency(listing.price)}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`badge text-xs ${statusColor[listing.status] || ''}`}>
                    {listing.status}
                  </span>
                  <span className="text-xs text-steel-400 flex items-center gap-1">
                    <Eye size={11} /> {listing.viewsCount}
                  </span>
                  <span className="text-xs text-steel-400">{formatRelativeDate(listing.createdAt)}</span>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <Link
                  to={`/anuncio/${listing.slug}`}
                  className="p-2 text-steel-400 hover:text-navy-700 rounded-lg"
                >
                  <Eye size={16} />
                </Link>
                <button className="p-2 text-steel-400 hover:text-navy-700 rounded-lg">
                  <Pencil size={16} />
                </button>
                {listing.status === 'ACTIVE' ? (
                  <button className="p-2 text-steel-400 hover:text-yellow-600 rounded-lg">
                    <PauseCircle size={16} />
                  </button>
                ) : listing.status === 'PAUSED' ? (
                  <button className="p-2 text-steel-400 hover:text-green-600 rounded-lg">
                    <PlayCircle size={16} />
                  </button>
                ) : null}
                <button className="p-2 text-steel-400 hover:text-red-500 rounded-lg">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <Plus size={40} className="mx-auto mb-3 text-steel-300" />
          <p className="text-steel-400 mb-4">Você ainda não tem anúncios</p>
          <Link to="/anunciar" className="btn-primary inline-flex items-center gap-2">
            <Plus size={16} /> Criar primeiro anúncio
          </Link>
        </div>
      )}
    </div>
  )
}
