import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateListingDto } from './dto/create-listing.dto'
import { UpdateListingDto } from './dto/update-listing.dto'
import { slugify } from '../../common/utils/slugify'

@Injectable()
export class ListingsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateListingDto) {
    const baseSlug = slugify(dto.title)
    const count = await this.prisma.listing.count({ where: { slug: { startsWith: baseSlug } } })
    const slug = count > 0 ? `${baseSlug}-${count}` : baseSlug

    const { imageIds, ...data } = dto

    const listing = await this.prisma.listing.create({
      data: {
        ...data,
        userId,
        slug,
        images: imageIds?.length
          ? {
              create: imageIds.map((mediaId, index) => ({
                mediaId,
                order: index,
                isCover: index === 0,
              })),
            }
          : undefined,
      },
      include: {
        images: { include: { media: true }, orderBy: { order: 'asc' } },
        user: { select: { id: true, name: true, avatarUrl: true, verificationLevel: true } },
        category: true,
        brand: true,
      },
    })

    return listing
  }

  async findById(id: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
      include: {
        images: { include: { media: true }, orderBy: { order: 'asc' } },
        user: { select: { id: true, name: true, avatarUrl: true, verificationLevel: true, city: true, state: true, reputationScore: true } },
        category: true,
        brand: true,
      },
    })
    if (!listing) throw new NotFoundException('Anúncio não encontrado')

    await this.prisma.listing.update({ where: { id }, data: { viewsCount: { increment: 1 } } })
    return listing
  }

  async findBySlug(slug: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { slug },
      include: {
        images: { include: { media: true }, orderBy: { order: 'asc' } },
        user: { select: { id: true, name: true, avatarUrl: true, verificationLevel: true, city: true, state: true, reputationScore: true } },
        category: true,
        brand: true,
      },
    })
    if (!listing) throw new NotFoundException('Anúncio não encontrado')
    await this.prisma.listing.update({ where: { slug }, data: { viewsCount: { increment: 1 } } })
    return listing
  }

  async update(id: string, userId: string, dto: UpdateListingDto) {
    const listing = await this.prisma.listing.findUnique({ where: { id } })
    if (!listing) throw new NotFoundException()
    if (listing.userId !== userId) throw new ForbiddenException()

    const { imageIds, ...data } = dto
    return this.prisma.listing.update({ where: { id }, data })
  }

  async delete(id: string, userId: string) {
    const listing = await this.prisma.listing.findUnique({ where: { id } })
    if (!listing) throw new NotFoundException()
    if (listing.userId !== userId) throw new ForbiddenException()
    await this.prisma.listing.delete({ where: { id } })
  }

  async getUserListings(userId: string) {
    return this.prisma.listing.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        images: { where: { isCover: true }, include: { media: true }, take: 1 },
      },
    })
  }

  async toggleFavorite(userId: string, listingId: string) {
    const existing = await this.prisma.favorite.findUnique({
      where: { userId_listingId: { userId, listingId } },
    })

    if (existing) {
      await this.prisma.favorite.delete({ where: { userId_listingId: { userId, listingId } } })
      await this.prisma.listing.update({ where: { id: listingId }, data: { favoritesCount: { decrement: 1 } } })
      return { favorited: false }
    }

    await this.prisma.favorite.create({ data: { userId, listingId } })
    await this.prisma.listing.update({ where: { id: listingId }, data: { favoritesCount: { increment: 1 } } })
    return { favorited: true }
  }

  async getUserFavorites(userId: string) {
    return this.prisma.favorite.findMany({
      where: { userId },
      include: {
        listing: {
          include: {
            images: { where: { isCover: true }, include: { media: true }, take: 1 },
            user: { select: { id: true, name: true, verificationLevel: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  }
}
