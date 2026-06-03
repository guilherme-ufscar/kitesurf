import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Users, Package, CreditCard, Shield, Check, X, Eye, Trash2, Search } from 'lucide-react'
import { api } from '@/lib/api'

type Tab = 'users' | 'listings' | 'payments' | 'verifications'

export default function AdminPage() {
  const { t } = useTranslation()
  const [tab, setTab] = useState<Tab>('users')
  const [search, setSearch] = useState('')
  const queryClient = useQueryClient()

  const { data: stats } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: () => api.get('/admin/stats').then((r) => r.data),
  })

  const tabs = [
    { id: 'users', label: 'Usuários', icon: Users },
    { id: 'listings', label: 'Anúncios', icon: Package },
    { id: 'payments', label: 'Pagamentos', icon: CreditCard },
    { id: 'verifications', label: 'Verificações', icon: Shield },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-display text-3xl font-bold text-navy-900 mb-2">Painel Admin</h1>
      <p className="text-steel-500 mb-8">Gerenciamento da plataforma</p>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="card p-4">
          <p className="text-steel-500 text-sm">Usuários</p>
          <p className="text-2xl font-bold text-navy-800">{stats?.totalUsers || 0}</p>
        </div>
        <div className="card p-4">
          <p className="text-steel-500 text-sm">Anúncios ativos</p>
          <p className="text-2xl font-bold text-navy-800">{stats?.activeListings || 0}</p>
        </div>
        <div className="card p-4">
          <p className="text-steel-500 text-sm">Vendas</p>
          <p className="text-2xl font-bold text-navy-800">{stats?.totalSales || 0}</p>
        </div>
        <div className="card p-4">
          <p className="text-steel-500 text-sm">Receita total</p>
          <p className="text-2xl font-bold text-teal-600">
            R$ {(Number(stats?.totalRevenue) || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-steel-500 text-sm">Verificações pendentes</p>
          <p className="text-2xl font-bold text-amber-600">{stats?.pendingVerifications || 0}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-steel-200 mb-6">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id as Tab)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              tab === id
                ? 'border-teal-500 text-teal-600'
                : 'border-transparent text-steel-500 hover:text-navy-700'
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-steel-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar..."
          className="input pl-10 max-w-md"
        />
      </div>

      {/* Content */}
      {tab === 'users' && <UsersTab search={search} />}
      {tab === 'listings' && <ListingsTab search={search} />}
      {tab === 'payments' && <PaymentsTab search={search} />}
      {tab === 'verifications' && <VerificationsTab />}
    </div>
  )
}

function UsersTab({ search }: { search: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'users', search],
    queryFn: () => api.get('/admin/users', { params: { search, limit: 50 } }).then((r) => r.data),
  })

  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      api.patch(`/admin/users/${id}`, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'users'] }),
  })

  if (isLoading) return <div className="text-center py-10 text-steel-400">Carregando...</div>

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left text-xs text-steel-500 uppercase">
            <th className="pb-3">Nome</th>
            <th className="pb-3">Email</th>
            <th className="pb-3">Verificado</th>
            <th className="pb-3">Plano</th>
            <th className="pb-3">Anúncios</th>
            <th className="pb-3">Ações</th>
          </tr>
        </thead>
        <tbody>
          {data?.users?.map((user: any) => (
            <tr key={user.id} className="border-t border-steel-100">
              <td className="py-3">{user.name}</td>
              <td className="py-3 text-steel-500">{user.email}</td>
              <td className="py-3">
                <span className={`badge ${user.isVerified ? 'badge-teal' : 'badge-gray'}`}>
                  {user.isVerified ? 'Sim' : 'Não'}
                </span>
              </td>
              <td className="py-3 text-steel-500">{user.subscriptionPlan}</td>
              <td className="py-3">{user._count?.listings || 0}</td>
              <td className="py-3">
                <button
                  onClick={() => mutation.mutate({
                    id: user.id,
                    data: { isVerified: !user.isVerified, verificationLevel: user.isVerified ? 'BASIC' : 'VERIFIED' },
                  })}
                  className="p-1.5 rounded hover:bg-steel-100"
                  title={user.isVerified ? 'Remover verificação' : 'Aprovar verificação'}
                >
                  {user.isVerified ? <X size={14} className="text-red-500" /> : <Check size={14} className="text-teal-500" />}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ListingsTab({ search }: { search: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'listings', search],
    queryFn: () => api.get('/admin/listings', { params: { search, limit: 50 } }).then((r) => r.data),
  })

  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.patch(`/admin/listings/${id}`, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'listings'] }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/listings/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'listings'] }),
  })

  if (isLoading) return <div className="text-center py-10 text-steel-400">Carregando...</div>

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left text-xs text-steel-500 uppercase">
            <th className="pb-3">Título</th>
            <th className="pb-3">Vendedor</th>
            <th className="pb-3">Status</th>
            <th className="pb-3">Preço</th>
            <th className="pb-3">Ações</th>
          </tr>
        </thead>
        <tbody>
          {data?.listings?.map((listing: any) => (
            <tr key={listing.id} className="border-t border-steel-100">
              <td className="py-3">
                <a href={`/anuncio/${listing.slug}`} className="text-teal-600 hover:underline">
                  {listing.title}
                </a>
              </td>
              <td className="py-3 text-steel-500">{listing.user?.name}</td>
              <td className="py-3">
                <span className={`badge badge-${listing.status === 'ACTIVE' ? 'teal' : listing.status === 'SOLD' ? 'green' : 'gray'}`}>
                  {listing.status}
                </span>
              </td>
              <td className="py-3">R$ {Number(listing.price).toLocaleString('pt-BR')}</td>
              <td className="py-3">
                <div className="flex gap-1">
                  <a href={`/anuncio/${listing.slug}`} className="p-1.5 rounded hover:bg-steel-100" title="Ver">
                    <Eye size={14} />
                  </a>
                  <button
                    onClick={() => deleteMutation.mutate(listing.id)}
                    className="p-1.5 rounded hover:bg-steel-100"
                    title="Excluir"
                  >
                    <Trash2 size={14} className="text-red-500" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function PaymentsTab({ search }: { search: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'payments', search],
    queryFn: () => api.get('/admin/payments', { params: { limit: 50 } }).then((r) => r.data),
  })

  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.patch(`/admin/payments/${id}`, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'payments'] }),
  })

  if (isLoading) return <div className="text-center py-10 text-steel-400">Carregando...</div>

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left text-xs text-steel-500 uppercase">
            <th className="pb-3">Usuário</th>
            <th className="pb-3">Tipo</th>
            <th className="pb-3">Valor</th>
            <th className="pb-3">Status</th>
            <th className="pb-3">Data</th>
            <th className="pb-3">Ações</th>
          </tr>
        </thead>
        <tbody>
          {data?.payments?.map((payment: any) => (
            <tr key={payment.id} className="border-t border-steel-100">
              <td className="py-3">{payment.user?.name}</td>
              <td className="py-3 text-steel-500">{payment.type}</td>
              <td className="py-3">R$ {Number(payment.amount).toLocaleString('pt-BR')}</td>
              <td className="py-3">
                <span className={`badge badge-${
                  payment.status === 'APPROVED' ? 'teal' :
                  payment.status === 'PENDING' ? 'amber' : 'gray'
                }`}>
                  {payment.status}
                </span>
              </td>
              <td className="py-3 text-steel-500">{new Date(payment.createdAt).toLocaleDateString('pt-BR')}</td>
              <td className="py-3">
                {payment.status === 'PENDING' && (
                  <div className="flex gap-1">
                    <button
                      onClick={() => mutation.mutate({ id: payment.id, status: 'APPROVED' })}
                      className="p-1.5 rounded hover:bg-steel-100"
                      title="Aprovar"
                    >
                      <Check size={14} className="text-teal-500" />
                    </button>
                    <button
                      onClick={() => mutation.mutate({ id: payment.id, status: 'REJECTED' })}
                      className="p-1.5 rounded hover:bg-steel-100"
                      title="Rejeitar"
                    >
                      <X size={14} className="text-red-500" />
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function VerificationsTab() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'verifications'],
    queryFn: () => api.get('/admin/verifications', { params: { status: 'PENDING' } }).then((r) => r.data),
  })

  const mutation = useMutation({
    mutationFn: ({ id, action, notes }: { id: string; action: 'approve' | 'reject'; notes?: string }) =>
      action === 'approve'
        ? api.patch(`/admin/verifications/${id}/approve`)
        : api.patch(`/admin/verifications/${id}/reject`, { notes }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'verifications'] }),
  })

  if (isLoading) return <div className="text-center py-10 text-steel-400">Carregando...</div>

  return (
    <div className="space-y-4">
      {data?.requests?.length === 0 ? (
        <div className="text-center py-10 text-steel-400">Nenhuma solicitação pendente</div>
      ) : (
        data?.requests?.map((req: any) => (
          <div key={req.id} className="card p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-navy-800 flex items-center justify-center text-white font-bold">
                {req.user?.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="font-semibold">{req.user?.name}</p>
                <p className="text-sm text-steel-500">{req.user?.email}</p>
              </div>
              <span className="badge badge-amber ml-auto">Pendente</span>
            </div>
            <p className="text-sm text-steel-500 mb-4">
              Solicitado em {new Date(req.createdAt).toLocaleDateString('pt-BR')}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => mutation.mutate({ id: req.id, action: 'approve' })}
                className="btn-primary text-sm px-3 py-1.5"
                disabled={mutation.isPending}
              >
                <Check size={14} className="inline mr-1" /> Aprovar
              </button>
              <button
                onClick={() => mutation.mutate({ id: req.id, action: 'reject' })}
                className="btn-secondary text-sm px-3 py-1.5"
                disabled={mutation.isPending}
              >
                <X size={14} className="inline mr-1" /> Rejeitar
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  )
}