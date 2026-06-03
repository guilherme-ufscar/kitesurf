import { Controller, Post, Body } from '@nestjs/common'
import { IsString } from 'class-validator'
import { TranslateService } from './translate.service'

class TranslateDto {
  @IsString()
  text: string

  @IsString()
  to: string

  @IsString()
  from?: string
}

@Controller('translate')
export class TranslateController {
  constructor(private translate: TranslateService) {}

  @Post()
  async translate(@Body() dto: TranslateDto) {
    const translated = await this.translate.translate(dto.text, dto.to, dto.from || 'pt')
    return { translated }
  }
}
