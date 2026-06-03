import { Link } from 'react-router-dom'
import { MapPin, Eye, Heart, ShieldCheck } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { formatCurrency, formatRelativeDate } from '@/lib/utils'
import type { ListingCard as ListingCardType } from '@kite360/shared'
import { cn } from '@/lib/utils'

interface Props {
  listing: ListingCardType
  className?: string
}

export default function ListingCard({ listing, className }: Props) {
  const { t } = useTranslation()

  return (
    <Link
      to={`/anuncio/${listing.slug}`}
      className={cn('card group hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col', className)}
    >
      <div className="relative aspect-[4/3] bg-steel-100 overflow-hidden">
        {listing.coverImageUrl ? (
          <img
            src={listing.coverImageUrl}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-steel-300">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {listing.isFeatured && (
          <div className="absolute top-2 left-2 badge bg-teal-600 text-white text-xs">
            Destaque
          </div>
        )}

        <div className="absolute top-2 right-2 badge bg-white/90 text-navy-700 text-xs">
          {t(`listing.condition.${listing.condition}`)}
        </div>
      </div>

      <div className="p-3 flex flex-col flex-1">
        <p className="text-lg font-bold text-navy-900 font-display leading-tight">
          {formatCurrency(listing.price)}
        </p>

        <h3 className="text-sm text-navy-700 font-medium mt-1 line-clamp-2 flex-1">
          {listing.title}
        </h3>

        <div className="mt-2 flex items-center gap-1 text-xs text-steel-500">
          <MapPin size={11} />
          <span>{listing.city}, {listing.state}</span>
        </div>

        <div className="mt-2.5 pt-2.5 border-t border-steel-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-navy-800 flex items-center justify-center text-white text-xs font-semibold overflow-hidden">
              {listing.seller.avatarUrl ? (
                <img src={listing.seller.avatarUrl} alt={listing.seller.name} className="w-full h-full object-cover" />
              ) : (
                listing.seller.name[0].toUpperCase()
              )}
            </div>
            <span className="text-xs text-steel-500 truncate max-w-[80px]">{listing.seller.name}</span>
            {listing.seller.verificationLevel !== 'BASIC' && (
              <ShieldCheck size={12} className="text-teal-600 shrink-0" />
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-steel-400">
            <span className="flex items-center gap-0.5">
              <Eye size={11} />
              {listing.viewsCount}
            </span>
            <span className="flex items-center gap-0.5">
              <Heart size={11} />
              {listing.favoritesCount}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
