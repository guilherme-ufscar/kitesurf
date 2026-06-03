import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ShieldCheck, Star, Package } from 'lucide-react'
import { api } from '@/lib/api'
import ListingCard from '@/components/ui/ListingCard'

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>()

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', id],
    queryFn: () => api.get(`/users/${id}`).then((r) => r.data),
    enabled: !!id,
  })

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 animate-pulse">
        <div className="flex gap-4 mb-8">
          <div className="w-20 h-20 rounded-2xl bg-steel-200" />
          <div className="flex-1 space-y-2">
            <div className="h-6 bg-steel-200 rounded w-1/3" />
            <div className="h-4 bg-steel-100 rounded w-1/4" />
          </div>
        </div>
      </div>
    )
  }

  if (!profile) return null

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="card p-6 mb-6">
        <div className="flex items-start gap-5">
          <div className="w-20 h-20 rounded-2xl bg-navy-800 flex items-center justify-center text-white text-2xl font-bold overflow-hidden shrink-0">
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
            ) : (
              profile.name[0].toUpperCase()
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="font-display text-xl font-bold text-navy-900">{profile.name}</h1>
              {profile.isVerified && <ShieldCheck size={18} className="text-teal-600" />}
            </div>

            <div className="flex items-center gap-4 text-sm text-steel-500">
              <span className="flex items-center gap-1">
                <Star size={14} className="text-yellow-500 fill-current" />
                {profile.reputationScore.toFixed(1)} reputação
              </span>
              <span className="flex items-center gap-1">
                <Package size={14} />
                {profile.totalSales} vendas
              </span>
              <span>{profile.city}, {profile.state}</span>
            </div>
          </div>
        </div>
      </div>

      {profile.listings?.length > 0 && (
        <div>
          <h2 className="font-display font-bold text-navy-900 text-lg mb-4">
            Anúncios ativos ({profile.listings.length})
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {profile.listings.map((listing: any) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
