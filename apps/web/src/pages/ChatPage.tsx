import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Send } from 'lucide-react'
import { io, Socket } from 'socket.io-client'
import { api } from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'

let socket: Socket | null = null

export default function ChatPage() {
  const [params] = useSearchParams()
  const convId = params.get('conv')
  const user = useAuthStore((s) => s.user)
  const [selected, setSelected] = useState<string | null>(convId)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<any[]>([])
  const bottomRef = useRef<HTMLDivElement>(null)
  const queryClient = useQueryClient()

  const { data: conversations } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => api.get('/chat/conversations').then((r) => r.data),
  })

  useEffect(() => {
    const token = localStorage.getItem('kite360_token')
    if (!token) return

    socket = io(`${import.meta.env.VITE_WS_URL || ''}/chat`, { auth: { token } })

    socket.on('new_message', (msg) => {
      setMessages((prev) => [...prev, msg])
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    })

    return () => { socket?.disconnect(); socket = null }
  }, [])

  useEffect(() => {
    if (!selected) return
    socket?.emit('join_conversation', selected)
    api.get(`/chat/conversations/${selected}/messages`).then((r) => {
      setMessages(r.data.reverse())
    })
  }, [selected])

  const send = () => {
    if (!message.trim() || !selected || !socket) return
    socket.emit('send_message', { conversationId: selected, content: message })
    setMessage('')
  }

  const otherUser = (conv: any) => {
    if (!user) return null
    return conv.buyerId === user.id ? conv.seller : conv.buyer
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 h-[calc(100vh-5rem)]">
      <div className="card h-full flex overflow-hidden">
        {/* Conversations list */}
        <div className="w-72 border-r border-steel-100 flex flex-col shrink-0">
          <div className="p-4 border-b border-steel-100">
            <h2 className="font-semibold text-navy-800">Mensagens</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations?.map((conv: any) => {
              const other = otherUser(conv)
              const lastMsg = conv.messages?.[0]
              return (
                <button
                  key={conv.id}
                  onClick={() => setSelected(conv.id)}
                  className={`w-full text-left p-4 hover:bg-steel-50 transition-colors border-b border-steel-50 ${
                    selected === conv.id ? 'bg-teal-50 border-l-2 border-l-teal-500' : ''
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-navy-800 flex items-center justify-center text-white text-sm font-semibold shrink-0 overflow-hidden">
                      {other?.avatarUrl ? (
                        <img src={other.avatarUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        other?.name?.[0]?.toUpperCase()
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-navy-800 text-sm truncate">{other?.name}</p>
                      <p className="text-xs text-steel-400 truncate">{conv.listing?.title}</p>
                      {lastMsg && (
                        <p className="text-xs text-steel-400 truncate mt-0.5">{lastMsg.content}</p>
                      )}
                    </div>
                  </div>
                </button>
              )
            })}

            {!conversations?.length && (
              <div className="p-6 text-center text-steel-400 text-sm">
                Nenhuma conversa ainda
              </div>
            )}
          </div>
        </div>

        {/* Chat window */}
        {selected ? (
          <div className="flex-1 flex flex-col min-w-0">
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg: any) => {
                const isMe = msg.senderId === user?.id
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${
                        isMe
                          ? 'bg-teal-600 text-white rounded-br-sm'
                          : 'bg-steel-100 text-navy-800 rounded-bl-sm'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                )
              })}
              <div ref={bottomRef} />
            </div>

            <div className="p-4 border-t border-steel-100">
              <div className="flex gap-2">
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
                  placeholder="Escreva uma mensagem..."
                  className="input flex-1"
                />
                <button
                  onClick={send}
                  disabled={!message.trim()}
                  className="btn-primary px-4 disabled:opacity-50"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-steel-400">
            <div className="text-center">
              <Send size={40} className="mx-auto mb-3 text-steel-300" />
              <p>Selecione uma conversa</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
