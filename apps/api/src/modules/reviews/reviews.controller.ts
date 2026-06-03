import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ReviewsService } from './reviews.service'
import { CreateReviewDto } from './dto/create-review.dto'

@Controller('reviews')
export class ReviewsController {
  constructor(private reviews: ReviewsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Request() req: any, @Body() dto: CreateReviewDto) {
    return this.reviews.create(req.user.id, dto)
  }

  @Get('user/:id')
  getUserReviews(@Param('id') id: string) {
    return this.reviews.getUserReviews(id)
  }
}
