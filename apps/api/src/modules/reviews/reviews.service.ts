import { Injectable, ConflictException } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateReviewDto } from './dto/create-review.dto'

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(reviewerId: string, dto: CreateReviewDto) {
    const review = await this.prisma.review.create({
      data: { ...dto, reviewerId },
      include: { reviewer: { select: { id: true, name: true, avatarUrl: true } } },
    })

    const stats = await this.prisma.review.aggregate({
      where: { reviewedId: dto.reviewedId },
      _avg: { rating: true },
    })

    await this.prisma.user.update({
      where: { id: dto.reviewedId },
      data: { reputationScore: stats._avg.rating || 0 },
    })

    return review
  }

  async getUserReviews(userId: string) {
    return this.prisma.review.findMany({
      where: { reviewedId: userId },
      include: { reviewer: { select: { id: true, name: true, avatarUrl: true } } },
      orderBy: { createdAt: 'desc' },
    })
  }
}
