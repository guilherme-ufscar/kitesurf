import {
  Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request, HttpCode,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ListingsService } from './listings.service'
import { CreateListingDto } from './dto/create-listing.dto'
import { UpdateListingDto } from './dto/update-listing.dto'

@Controller('listings')
export class ListingsController {
  constructor(private listings: ListingsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Request() req: any, @Body() dto: CreateListingDto) {
    return this.listings.create(req.user.id, dto)
  }

  @Get('my')
  @UseGuards(AuthGuard('jwt'))
  getMyListings(@Request() req: any) {
    return this.listings.getUserListings(req.user.id)
  }

  @Get('favorites')
  @UseGuards(AuthGuard('jwt'))
  getFavorites(@Request() req: any) {
    return this.listings.getUserFavorites(req.user.id)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.listings.findById(id)
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.listings.findBySlug(slug)
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Request() req: any, @Body() dto: UpdateListingDto) {
    return this.listings.update(id, req.user.id, dto)
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(AuthGuard('jwt'))
  delete(@Param('id') id: string, @Request() req: any) {
    return this.listings.delete(id, req.user.id)
  }

  @Post(':id/favorite')
  @UseGuards(AuthGuard('jwt'))
  toggleFavorite(@Param('id') id: string, @Request() req: any) {
    return this.listings.toggleFavorite(req.user.id, id)
  }
}
