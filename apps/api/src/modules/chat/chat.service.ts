import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async getOrCreateConversation(listingId: string, buyerId: string) {
    const listing = await this.prisma.listing.findUnique({ where: { id: listingId } })
    if (!listing) throw new NotFoundException('Anúncio não encontrado')
    if (listing.userId === buyerId) throw new ForbiddenException('Não pode iniciar conversa com seu próprio anúncio')

    return this.prisma.conversation.upsert({
      where: { listingId_buyerId: { listingId, buyerId } },
      create: { listingId, buyerId, sellerId: listing.userId },
      update: {},
      include: {
        listing: { select: { id: true, title: true, slug: true } },
        buyer: { select: { id: true, name: true, avatarUrl: true } },
        seller: { select: { id: true, name: true, avatarUrl: true } },
        messages: { orderBy: { createdAt: 'asc' }, take: 50 },
      },
    })
  }

  async getUserConversations(userId: string) {
    return this.prisma.conversation.findMany({
      where: {
        OR: [{ buyerId: userId }, { sellerId: userId }],
      },
      include: {
        listing: { select: { id: true, title: true, slug: true } },
        buyer: { select: { id: true, name: true, avatarUrl: true } },
        seller: { select: { id: true, name: true, avatarUrl: true } },
        messages: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
      orderBy: { lastMessageAt: 'desc' },
    })
  }

  async getMessages(conversationId: string, userId: string, cursor?: string) {
    const conv = await this.prisma.conversation.findUnique({ where: { id: conversationId } })
    if (!conv) throw new NotFoundException()
    if (conv.buyerId !== userId && conv.sellerId !== userId) throw new ForbiddenException()

    return this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'desc' },
      take: 50,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    })
  }

  async saveMessage(conversationId: string, senderId: string, content: string) {
    const [message] = await Promise.all([
      this.prisma.message.create({
        data: { conversationId, senderId, content },
        include: { sender: { select: { id: true, name: true, avatarUrl: true } } },
      }),
      this.prisma.conversation.update({
        where: { id: conversationId },
        data: { lastMessageAt: new Date() },
      }),
    ])
    return message
  }

  async markAsRead(conversationId: string, userId: string) {
    await this.prisma.message.updateMany({
      where: { conversationId, readAt: null, NOT: { senderId: userId } },
      data: { readAt: new Date() },
    })
  }
}
