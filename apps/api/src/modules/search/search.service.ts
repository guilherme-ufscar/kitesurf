import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { SearchDto } from './dto/search.dto'

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async search(dto: SearchDto) {
    const {
      q, category, brand, modality, condition, state, city,
      minPrice, maxPrice, featured, page = 1, limit = 24,
    } = dto

    const where: any = { status: 'ACTIVE' }

    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { city: { contains: q, mode: 'insensitive' } },
      ]
    }
    if (category) where.categoryId = category
    if (brand) where.brandId = brand
    if (modality) where.modality = modality
    if (condition) where.condition = condition
    if (state) where.state = { equals: state, mode: 'insensitive' }
    if (city) where.city = { contains: city, mode: 'insensitive' }
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {}
      if (minPrice !== undefined) where.price.gte = minPrice
      if (maxPrice !== undefined) where.price.lte = maxPrice
    }
    if (featured) where.isFeatured = true

    const skip = (page - 1) * limit

    const [data, total] = await Promise.all([
      this.prisma.listing.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
        include: {
          images: { where: { isCover: true }, include: { media: true }, take: 1 },
          user: { select: { id: true, name: true, avatarUrl: true, verificationLevel: true } },
          brand: { select: { id: true, name: true } },
          category: { select: { id: true, name: true, slug: true } },
        },
      }),
      this.prisma.listing.count({ where }),
    ])

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }
  }

  async getFeatured(limit = 8) {
    return this.prisma.listing.findMany({
      where: { status: 'ACTIVE', isFeatured: true },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        images: { where: { isCover: true }, include: { media: true }, take: 1 },
        user: { select: { id: true, name: true, avatarUrl: true, verificationLevel: true } },
      },
    })
  }

  async getRecent(limit = 16) {
    return this.prisma.listing.findMany({
      where: { status: 'ACTIVE' },
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        images: { where: { isCover: true }, include: { media: true }, take: 1 },
        user: { select: { id: true, name: true, avatarUrl: true, verificationLevel: true } },
      },
    })
  }
}
