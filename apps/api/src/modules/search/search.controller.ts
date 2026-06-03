import { Controller, Get, Query } from '@nestjs/common'
import { SearchService } from './search.service'
import { SearchDto } from './dto/search.dto'

@Controller('search')
export class SearchController {
  constructor(private searchSvc: SearchService) {}

  @Get()
  search(@Query() dto: SearchDto) {
    return this.searchSvc.search(dto)
  }

  @Get('featured')
  getFeatured(@Query('limit') limit?: string) {
    return this.searchSvc.getFeatured(limit ? parseInt(limit) : 8)
  }

  @Get('recent')
  getRecent(@Query('limit') limit?: string) {
    return this.searchSvc.getRecent(limit ? parseInt(limit) : 16)
  }
}
