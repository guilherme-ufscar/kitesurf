import { useState } from 'react'
import { useNotifications } from '@/hooks/useNotifications'
import { Bell, Check, X, ExternalLink } from 'lucide-react'
import { formatRelativeDate } from '@/lib/utils'

export default function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications()
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-xl hover:bg-steel-100 transition-colors"
        aria-label="Notificações"
      >
        <Bell size={20} className="text-navy-700" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-steel-100 z-50 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-steel-100">
              <h3 className="font-semibold text-navy-800">Notificações</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-teal-600 hover:text-teal-700 flex items-center gap-1"
                >
                  <Check size={12} /> Marcar todas como lidas
                </button>
              )}
            </div>

            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-steel-400 text-sm">
                  Nenhuma notificação
                </div>
              ) : (
                notifications.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => {
                      markAsRead(n.id)
                      if (n.link) window.location.href = n.link
                      setOpen(false)
                    }}
                    className={`w-full text-left p-4 hover:bg-steel-50 transition-colors border-b border-steel-50 last:border-0 ${
                      !n.readAt ? 'bg-teal-50/30' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${!n.readAt ? 'bg-teal-500' : 'bg-transparent'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-navy-800 text-sm">{n.title}</p>
                        <p className="text-steel-500 text-xs mt-0.5 line-clamp-2">{n.message}</p>
                        <p className="text-steel-400 text-xs mt-1">{formatRelativeDate(n.createdAt)}</p>
                      </div>
                      {n.link && <ExternalLink size={12} className="text-steel-400 mt-1 shrink-0" />}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}