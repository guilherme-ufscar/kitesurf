import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Upload, X, Link as LinkIcon } from 'lucide-react'
import { api } from '@/lib/api'
import { Condition, Modality, ListingStatus } from '@kite360/shared'
import RichTextEditor from '@/components/ui/RichTextEditor'
import StepIndicator from '@/components/ui/StepIndicator'

export default function CreateListingPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<any[]>([])
  const [uploading, setUploading] = useState(false)

  const [form, setForm] = useState({
    title: '',
    price: '',
    condition: '' as Condition,
    modality: '' as Modality,
    year: '',
    size: '',
    city: '',
    state: '',
    youtubeUrl: '',
    categoryId: '',
    description: '',
    status: 'ACTIVE' as ListingStatus,
  })

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    setUploading(true)

    for (const file of Array.from(files)) {
      const fd = new FormData()
      fd.append('file', file)
      try {
        const res = await api.post('/media/upload', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        setUploadedImages((prev) => [...prev, res.data])
      } catch {}
    }

    setUploading(false)
    e.target.value = ''
  }

  const removeImage = (id: string) => {
    setUploadedImages((prev) => prev.filter((img) => img.id !== id))
    api.delete(`/media/${id}`).catch(() => null)
  }

  const handleSubmit = async (asDraft = false) => {
    setLoading(true)
    try {
      const res = await api.post('/listings', {
        ...form,
        price: parseFloat(form.price),
        year: form.year ? parseInt(form.year) : undefined,
        status: asDraft ? 'DRAFT' : 'ACTIVE',
        imageIds: uploadedImages.map((img) => img.id),
        description: form.description ? { type: 'doc', content: form.description } : undefined,
      })
      navigate(`/anuncio/${res.data.slug}`)
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao criar anúncio')
    } finally {
      setLoading(false)
    }
  }

  const canProceed = () => {
    if (step === 1) return form.title && form.modality && form.condition
    if (step === 2) return uploadedImages.length > 0
    return true
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-display text-2xl font-bold text-navy-900 mb-6">{t('listing.createTitle')}</h1>

      {/* Progress */}
      <StepIndicator currentStep={step} totalSteps={4} />

      <div className="card p-6 space-y-5">
        {step === 1 && (
          <>
            <h2 className="font-semibold text-navy-800">Informações básicas</h2>

            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">Título do anúncio *</label>
              <input value={form.title} onChange={set('title')} className="input" placeholder="Ex: North Orbit 12m 2023 excelente estado" maxLength={150} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1.5">Modalidade *</label>
                <select value={form.modality} onChange={set('modality')} className="input">
                  <option value="">Selecionar</option>
                  {Object.values(Modality).map((m) => (
                    <option key={m} value={m}>{t(`listing.modality.${m}`)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1.5">Condição *</label>
                <select value={form.condition} onChange={set('condition')} className="input">
                  <option value="">Selecionar</option>
                  {Object.values(Condition).map((c) => (
                    <option key={c} value={c}>{t(`listing.condition.${c}`)}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1.5">Ano</label>
                <input type="number" value={form.year} onChange={set('year')} className="input" placeholder="2023" min={2000} max={2030} />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1.5">Tamanho</label>
                <input value={form.size} onChange={set('size')} className="input" placeholder="Ex: 12m, 5'10" />
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="font-semibold text-navy-800">Fotos e vídeo</h2>

            <div>
              <div className="grid grid-cols-3 gap-3 mb-3">
                {uploadedImages.map((img) => (
                  <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden bg-steel-100">
                    <img src={img.thumbUrl} alt="" className="w-full h-full object-cover" />
                    <button
                      onClick={() => removeImage(img.id)}
                      className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}

                {uploadedImages.length < 10 && (
                  <label className="aspect-square rounded-xl border-2 border-dashed border-steel-200 flex flex-col items-center justify-center cursor-pointer hover:border-teal-400 hover:bg-teal-50 transition-colors">
                    {uploading ? (
                      <span className="w-5 h-5 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Upload size={20} className="text-steel-400 mb-1" />
                        <span className="text-xs text-steel-400">Adicionar foto</span>
                      </>
                    )}
                    <input type="file" accept="image/*" multiple hidden onChange={handleImageUpload} disabled={uploading} />
                  </label>
                )}
              </div>
              <p className="text-xs text-steel-400">Máx. 10 fotos · JPG, PNG, WebP · até 10MB cada</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5 flex items-center gap-1.5">
                <LinkIcon size={14} /> Link do vídeo no YouTube (opcional)
              </label>
              <input
                value={form.youtubeUrl}
                onChange={set('youtubeUrl')}
                className="input"
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="font-semibold text-navy-800">Descrição do equipamento</h2>

            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">Descreva seu equipamento em detalhes</label>
              <RichTextEditor
                value={form.description}
                onChange={(html) => setForm((f) => ({ ...f, description: html }))}
                placeholder="Descreva estado, história, upgrades, motivos da venda..."
              />
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <h2 className="font-semibold text-navy-800">Preço e localização</h2>

            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1.5">Preço (R$) *</label>
              <input
                type="number"
                value={form.price}
                onChange={set('price')}
                className="input"
                placeholder="0,00"
                min={0}
                step="0.01"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1.5">Cidade *</label>
                <input value={form.city} onChange={set('city')} className="input" placeholder="Ex: Fortaleza" />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1.5">Estado *</label>
                <input value={form.state} onChange={set('state')} className="input" placeholder="CE" maxLength={2} />
              </div>
            </div>
          </>
        )}
      </div>

      <div className="flex gap-3 mt-6">
        {step > 1 && (
          <button onClick={() => setStep(step - 1)} className="btn-secondary">
            {t('common.back')}
          </button>
        )}

        {step < 4 ? (
          <button
            onClick={() => setStep(step + 1)}
            disabled={!canProceed()}
            className="btn-primary ml-auto"
          >
            {t('common.next')}
          </button>
        ) : (
          <div className="flex gap-2 ml-auto">
            <button onClick={() => handleSubmit(true)} disabled={loading} className="btn-secondary">
              {t('listing.saveDraft')}
            </button>
            <button
              onClick={() => handleSubmit(false)}
              disabled={loading || !form.price || !form.city || !form.state}
              className="btn-primary"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Publicando...
                </span>
              ) : t('listing.publish')}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
