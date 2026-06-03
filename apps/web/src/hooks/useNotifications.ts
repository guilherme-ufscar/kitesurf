import { useState, useEffect, useCallback } from 'react'
import { io, Socket } from 'socket.io-client'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'

export interface Notification {
  id: string
  type: string
  title: string
  message: string
  link?: string
  readAt: string | null
  createdAt: string
}

export function useNotifications() {
  const user = useAuthStore((s) => s.user)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [socket, setSocket] = useState<Socket | null>(null)

  const fetchNotifications = useCallback(async () => {
    if (!user) return
    try {
      const res = await api.get('/notifications')
      setNotifications(res.data)
      setUnreadCount(res.data.filter((n: Notification) => !n.readAt).length)
    } catch (e) {
      console.error('Failed to fetch notifications', e)
    }
  }, [user])

  const fetchUnreadCount = useCallback(async () => {
    if (!user) return
    try {
      const res = await api.get('/notifications/unread-count')
      setUnreadCount(res.data)
    } catch (e) {
      console.error('Failed to fetch unread count', e)
    }
  }, [user])

  useEffect(() => {
    if (!user) return

    fetchNotifications()

    const token = localStorage.getItem('accessToken')
    if (!token) return

    const newSocket = io(import.meta.env.VITE_WS_URL || 'ws://localhost:3000', {
      path: '/notifications',
      auth: { token, userId: user.id },
      transports: ['websocket'],
    })

    newSocket.on('notification', (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev])
      setUnreadCount((prev) => prev + 1)
    })

    newSocket.on('connect', () => {
      newSocket.emit('authenticate', { token })
    })

    setSocket(newSocket)

    return () => {
      newSocket.disconnect()
    }
  }, [user, fetchNotifications])

  const markAsRead = async (id: string) => {
    try {
      await api.post(`/notifications/${id}/read`)
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, readAt: new Date().toISOString() } : n))
      )
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch (e) {
      console.error('Failed to mark as read', e)
    }
  }

  const markAllAsRead = async () => {
    try {
      await api.post('/notifications/read-all')
      setNotifications((prev) => prev.map((n) => ({ ...n, readAt: new Date().toISOString() })))
      setUnreadCount(0)
    } catch (e) {
      console.error('Failed to mark all as read', e)
    }
  }

  return { notifications, unreadCount, markAsRead, markAllAsRead, refetch: fetchNotifications }
}