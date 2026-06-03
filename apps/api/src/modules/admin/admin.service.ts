import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { Prisma } from '@prisma/client'

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  // Users
  async getUsers(params: {
    page?: number
    limit?: number
    search?: string
    verified?: boolean
  }) {
    const { page = 1, limit = 20, search, verified } = params
    const where: any = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (verified !== undefined) {
      where.isVerified = verified
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          isVerified: true,
          verificationLevel: true,
          subscriptionPlan: true,
          reputationScore: true,
          totalSales: true,
          createdAt: true,
          _count: { select: { listings: true, favorites: true } },
        },
      }),
      this.prisma.user.count({ where }),
    ])

    return { users, total, pages: Math.ceil(total / limit) }
  }

  async getUserById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        listings: { take: 10, orderBy: { createdAt: 'desc' } },
        givenReviews: { take: 5 },
        receivedReviews: { take: 5 },
        _count: { select: { listings: true } },
      },
    })
  }

  async updateUser(id: string, data: { isVerified?: boolean; verificationLevel?: string; subscriptionPlan?: string }) {
    return this.prisma.user.update({ where: { id }, data: data as any })
  }

  // Listings
  async getListings(params: {
    page?: number
    limit?: number
    search?: string
    status?: string
    userId?: string
  }) {
    const { page = 1, limit = 20, search, status, userId } = params
    const where: any = {}

    if (search) {
      where.title = { contains: search, mode: 'insensitive' }
    }

    if (status) {
      where.status = status as any
    }

    if (userId) {
      where.userId = userId
    }

    const [listings, total] = await Promise.all([
      this.prisma.listing.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, name: true, email: true } },
          _count: { select: { favorites: true } },
        },
      }),
      this.prisma.listing.count({ where }),
    ])

    return { listings, total, pages: Math.ceil(total / limit) }
  }

  async updateListing(id: string, data: { status?: string; isFeatured?: boolean; featuredUntil?: Date }) {
    return this.prisma.listing.update({ where: { id }, data: data as any })
  }

  async deleteListing(id: string) {
    return this.prisma.listing.delete({ where: { id } })
  }

  // Payments
  async getPayments(params: {
    page?: number
    limit?: number
    status?: string
    type?: string
  }) {
    const { page = 1, limit = 20, status, type } = params
    const where: any = {}

    if (status) where.status = status as any
    if (type) where.type = type as any

    const [payments, total] = await Promise.all([
      this.prisma.payment.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, name: true, email: true } },
          listing: { select: { id: true, title: true, slug: true } },
        },
      }),
      this.prisma.payment.count({ where }),
    ])

    return { payments, total, pages: Math.ceil(total / limit) }
  }

  async updatePaymentStatus(id: string, status: string) {
    return this.prisma.payment.update({ where: { id }, data: { status: status as any } })
  }

  // Verification requests
  async getVerificationRequests(params: { page?: number; limit?: number; status?: string }) {
    const { page = 1, limit = 20, status } = params
    const where: any = {}
    if (status) where.status = status as any

    const [requests, total] = await Promise.all([
      this.prisma.verificationRequest.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, name: true, email: true, avatarUrl: true } },
        },
      }),
      this.prisma.verificationRequest.count({ where }),
    ])

    return { requests, total, pages: Math.ceil(total / limit) }
  }

  async approveVerificationRequest(id: string) {
    return this.prisma.$transaction(async (tx) => {
      const request = await tx.verificationRequest.update({
        where: { id },
        data: { status: 'APPROVED' },
        include: { user: true },
      })

      await tx.user.update({
        where: { id: request.userId },
        data: { isVerified: true, verificationLevel: 'VERIFIED' },
      })

      return request
    })
  }

  async rejectVerificationRequest(id: string, notes?: string) {
    return this.prisma.verificationRequest.update({
      where: { id },
      data: { status: 'REJECTED', notes },
    })
  }

  // Dashboard stats
  async getStats() {
    const [
      totalUsers,
      activeListings,
      totalSales,
      pendingPayments,
      pendingVerifications,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.listing.count({ where: { status: 'ACTIVE' } }),
      this.prisma.payment.count({ where: { status: 'APPROVED' } }),
      this.prisma.payment.count({ where: { status: 'PENDING' } }),
      this.prisma.verificationRequest.count({ where: { status: 'PENDING' } }),
    ])

    const revenue = await this.prisma.payment.aggregate({
      where: { status: 'APPROVED' },
      _sum: { amount: true },
    })

    return {
      totalUsers,
      activeListings,
      totalSales,
      pendingPayments,
      pendingVerifications,
      totalRevenue: revenue._sum.amount || 0,
    }
  }
}