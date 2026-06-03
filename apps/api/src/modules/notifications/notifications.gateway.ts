import {
  WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection,
  ConnectedSocket, MessageBody, WsException,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { NotificationsService } from './notifications.service'
import { Injectable, UseGuards } from '@nestjs/common'

@WebSocketGateway({ cors: { origin: '*' }, namespace: '/notifications' })
@Injectable()
export class NotificationsGateway {
  @WebSocketServer()
  server: Server

  private userSockets = new Map<string, Set<string>>()

  constructor(private notifications: NotificationsService) {}

  async handleConnection(client: Socket) {
    const userId = this.extractUserId(client)
    if (userId) {
      if (!this.userSockets.has(userId)) {
        this.userSockets.set(userId, new Set())
      }
      this.userSockets.get(userId)!.add(client.id)
      client.join(`user:${userId}`)
    }
  }

  async handleDisconnect(client: Socket) {
    const userId = this.extractUserId(client)
    if (userId) {
      this.userSockets.get(userId)?.delete(client.id)
      if (this.userSockets.get(userId)?.size === 0) {
        this.userSockets.delete(userId)
      }
    }
  }

  private extractUserId(client: Socket): string | null {
    const token = client.handshake.auth?.token || client.handshake.headers?.authorization?.replace('Bearer ', '')
    if (!token) return null
    try {
      // In real implementation, verify JWT and extract user ID
      // For now, we'll use a simple approach
      return client.handshake.auth?.userId || null
    } catch {
      return null
    }
  }

  @SubscribeMessage('authenticate')
  handleAuth(@ConnectedSocket() client: Socket, @MessageBody() data: { token: string }) {
    try {
      // Verify token and get userId
      // This is simplified - real implementation would use JWT verification
      const userId = this.verifyToken(data.token)
      if (userId) {
        client.join(`user:${userId}`)
        if (!this.userSockets.has(userId)) {
          this.userSockets.set(userId, new Set())
        }
        this.userSockets.get(userId)!.add(client.id)
        return { success: true }
      }
      throw new WsException('Invalid token')
    } catch {
      throw new WsException('Authentication failed')
    }
  }

  private verifyToken(token: string): string | null {
    // Simplified - real implementation would use JWT
    try {
      // Decode JWT payload (base64) - for demo purposes only
      const parts = token.split('.')
      if (parts.length === 3) {
        const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString())
        return payload.sub || payload.userId || null
      }
      return null
    } catch {
      return null
    }
  }

  async sendToUser(userId: string, event: string, data: any) {
    this.server.to(`user:${userId}`).emit(event, data)
  }

  async sendNotification(userId: string, notification: {
    type: string
    title: string
    message: string
    link?: string
  }) {
    // Store in database
    const stored = await this.notifications.create(userId, notification)

    // Send via WebSocket
    this.sendToUser(userId, 'notification', {
      id: stored.id,
      ...notification,
      createdAt: stored.createdAt,
    })
  }
}