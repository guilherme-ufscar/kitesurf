import { useQuery } from '@tanstack/react-query'
import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { api } from '@/lib/api'
import ListingCard from '@/components/ui/ListingCard'

export default function FavoritesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['favorites'],
    queryFn: () => api.get('/listings/favorites').then((r) => r.data),
  })

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-display text-2xl font-bold text-navy-900 mb-6">Favoritos</h1>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card aspect-[3/4] bg-steel-100" />
          ))}
        </div>
      ) : data?.length ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {data.map((fav: any) => (
            <ListingCard key={fav.id} listing={fav.listing} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <Heart size={40} className="mx-auto mb-3 text-steel-300" />
          <p className="text-steel-400 mb-4">Nenhum favorito ainda</p>
          <Link to="/busca" className="btn-primary inline-flex">
            Explorar anúncios
          </Link>
        </div>
      )}
    </div>
  )
}
