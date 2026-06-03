import {
  WebSocketGateway, WebSocketServer, SubscribeMessage,
  MessageBody, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { JwtService } from '@nestjs/jwt'
import { ChatService } from './chat.service'

@WebSocketGateway({ cors: { origin: '*' }, namespace: '/chat' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server

  private userSockets = new Map<string, string>()

  constructor(
    private chat: ChatService,
    private jwt: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    const token = client.handshake.auth?.token
    if (!token) { client.disconnect(); return }

    try {
      const payload = this.jwt.verify<{ sub: string }>(token)
      client.data.userId = payload.sub
      this.userSockets.set(payload.sub, client.id)
    } catch {
      client.disconnect()
    }
  }

  handleDisconnect(client: Socket) {
    if (client.data.userId) {
      this.userSockets.delete(client.data.userId)
    }
  }

  @SubscribeMessage('join_conversation')
  handleJoin(@MessageBody() conversationId: string, @ConnectedSocket() client: Socket) {
    client.join(`conv:${conversationId}`)
  }

  @SubscribeMessage('send_message')
  async handleMessage(
    @MessageBody() data: { conversationId: string; content: string },
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client.data.userId
    if (!userId) return

    const message = await this.chat.saveMessage(data.conversationId, userId, data.content)
    this.server.to(`conv:${data.conversationId}`).emit('new_message', message)
  }

  @SubscribeMessage('mark_read')
  async handleMarkRead(
    @MessageBody() conversationId: string,
    @ConnectedSocket() client: Socket,
  ) {
    await this.chat.markAsRead(conversationId, client.data.userId)
    this.server.to(`conv:${conversationId}`).emit('messages_read', {
      conversationId,
      userId: client.data.userId,
    })
  }

  @SubscribeMessage('typing')
  handleTyping(
    @MessageBody() data: { conversationId: string; isTyping: boolean },
    @ConnectedSocket() client: Socket,
  ) {
    client.to(`conv:${data.conversationId}`).emit('user_typing', {
      userId: client.data.userId,
      isTyping: data.isTyping,
    })
  }
}
