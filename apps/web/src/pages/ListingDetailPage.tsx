import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { MapPin, Eye, Heart, ShieldCheck, MessageCircle, Share2, Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { api } from '@/lib/api'
import { formatCurrency, formatRelativeDate, extractYoutubeId } from '@/lib/utils'
import { useAuthStore } from '@/stores/authStore'
import SEO from '@/components/SEO'

export default function ListingDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const [imgIdx, setImgIdx] = useState(0)

  const { data: listing, isLoading } = useQuery({
    queryKey: ['listing', slug],
    queryFn: () => api.get(`/listings/slug/${slug}`).then((r) => r.data),
    enabled: !!slug,
  })

  const handleContact = async () => {
    if (!user) { navigate('/entrar'); return }
    const res = await api.post('/chat/conversations', { listingId: listing.id })
    navigate(`/mensagens?conv=${res.data.id}`)
  }

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10 animate-pulse">
        <div className="h-96 bg-steel-100 rounded-2xl mb-6" />
        <div className="h-8 bg-steel-100 rounded w-2/3 mb-3" />
        <div className="h-6 bg-steel-100 rounded w-1/4" />
      </div>
    )
  }

  if (!listing) return null

  const images = listing.images || []
  const ytId = listing.youtubeUrl ? extractYoutubeId(listing.youtubeUrl) : null
  const coverImage = images[0]?.media?.webpUrl

  return (
    <>
      <SEO
        title={listing.title}
        description={`${listing.title} - ${listing.condition} - R$ ${listing.price.toLocaleString('pt-BR')} em ${listing.city}, ${listing.state}`}
        image={coverImage}
        type="product"
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-16">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-steel-500 hover:text-navy-800 mb-4 text-sm">
        <ChevronLeft size={16} /> Voltar
      </button>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Images */}
        <div className="lg:col-span-3 space-y-3">
          <div className="relative aspect-[4/3] bg-steel-100 rounded-2xl overflow-hidden">
            {images[imgIdx] ? (
              <img
                src={images[imgIdx].media.webpUrl}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-steel-300 text-sm">
                Sem imagem
              </div>
            )}

            {images.length > 1 && (
              <>
                <button
                  onClick={() => setImgIdx((i) => Math.max(0, i - 1))}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => setImgIdx((i) => Math.min(images.length - 1, i + 1))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center shadow"
                >
                  <ChevronRight size={16} />
                </button>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img: any, i: number) => (
                <button
                  key={img.id}
                  onClick={() => setImgIdx(i)}
                  className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                    i === imgIdx ? 'border-teal-500' : 'border-transparent'
                  }`}
                >
                  <img src={img.media.thumbUrl} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {ytId && (
            <div className="aspect-video rounded-2xl overflow-hidden">
              <iframe
                src={`https://www.youtube.com/embed/${ytId}`}
                className="w-full h-full"
                allowFullScreen
                title="Video do equipamento"
              />
            </div>
          )}

          {listing.description && (
            <div className="card p-5">
              <h3 className="font-semibold text-navy-800 mb-3">Descrição</h3>
              <div
                className="prose prose-sm max-w-none text-navy-700"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(listing.description) }}
              />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card p-5">
            <div className="flex items-start justify-between gap-2 mb-3">
              <div>
                <div className="flex gap-2 mb-2">
                  <span className="badge badge-teal">{t(`listing.modality.${listing.modality}`)}</span>
                  <span className="badge badge-navy">{t(`listing.condition.${listing.condition}`)}</span>
                </div>
                <h1 className="font-display text-2xl font-bold text-navy-900 leading-tight">
                  {listing.title}
                </h1>
              </div>
            </div>

            <p className="font-display text-3xl font-bold text-teal-600 mb-4">
              {formatCurrency(listing.price)}
            </p>

            <div className="flex items-center gap-1.5 text-steel-500 text-sm mb-4">
              <MapPin size={14} />
              {listing.city}, {listing.state}
            </div>

            <div className="flex items-center gap-3 text-xs text-steel-400 mb-5">
              <span className="flex items-center gap-1"><Eye size={12} /> {listing.viewsCount} {t('listing.views')}</span>
              <span className="flex items-center gap-1"><Heart size={12} /> {listing.favoritesCount}</span>
              <span>{t('listing.postedAt')} {formatRelativeDate(listing.createdAt)}</span>
            </div>

            <button onClick={handleContact} className="btn-primary w-full justify-center flex items-center gap-2 mb-2">
              <MessageCircle size={16} />
              {t('listing.contact')}
            </button>

            <div className="flex gap-2">
              <button className="btn-secondary flex-1 justify-center flex items-center gap-2 text-sm">
                <Heart size={15} /> {t('listing.favorite')}
              </button>
              <button className="btn-secondary flex-1 justify-center flex items-center gap-2 text-sm">
                <Share2 size={15} /> {t('listing.share')}
              </button>
            </div>
          </div>

          {/* Seller */}
          <div className="card p-5">
            <h3 className="font-semibold text-navy-800 mb-3 text-sm">{t('listing.sellerInfo')}</h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-navy-800 flex items-center justify-center text-white font-bold overflow-hidden">
                {listing.user.avatarUrl ? (
                  <img src={listing.user.avatarUrl} alt={listing.user.name} className="w-full h-full object-cover" />
                ) : (
                  listing.user.name[0].toUpperCase()
                )}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="font-semibold text-navy-800">{listing.user.name}</p>
                  {listing.user.verificationLevel !== 'BASIC' && (
                    <ShieldCheck size={14} className="text-teal-600" />
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs text-steel-500">
                  <Star size={11} className="text-yellow-500 fill-current" />
                  {listing.user.reputationScore.toFixed(1)}
                  <span className="text-steel-400">· {listing.user.city}, {listing.user.state}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
