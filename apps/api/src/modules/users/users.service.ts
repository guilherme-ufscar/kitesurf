import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { UpdateProfileDto } from './dto/update-profile.dto'

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        phone: true,
        bio: true,
        city: true,
        state: true,
        country: true,
        whatsapp: true,
        isVerified: true,
        verificationLevel: true,
        reputationScore: true,
        totalSales: true,
        totalPurchases: true,
        subscriptionPlan: true,
        subscriptionExpiresAt: true,
        createdAt: true,
        lastSeenAt: true,
      },
    })
    if (!user) throw new NotFoundException('Usuário não encontrado')
    return user
  }

  async findPublicProfile(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        avatarUrl: true,
        city: true,
        state: true,
        isVerified: true,
        verificationLevel: true,
        reputationScore: true,
        totalSales: true,
        createdAt: true,
        listings: {
          where: { status: 'ACTIVE' },
          take: 20,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true, title: true, slug: true, price: true,
            condition: true, modality: true, city: true, state: true,
            isFeatured: true, createdAt: true,
          },
        },
        receivedReviews: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: { reviewer: { select: { id: true, name: true, avatarUrl: true } } },
        },
      },
    })
    if (!user) throw new NotFoundException('Usuário não encontrado')
    return user
  }

  async updateProfile(id: string, dto: UpdateProfileDto) {
    return this.prisma.user.update({
      where: { id },
      data: dto,
      select: { id: true, name: true, bio: true, city: true, state: true, phone: true, whatsapp: true },
    })
  }

  async updateAvatar(id: string, avatarUrl: string) {
    return this.prisma.user.update({
      where: { id },
      data: { avatarUrl },
      select: { id: true, avatarUrl: true },
    })
  }
}
