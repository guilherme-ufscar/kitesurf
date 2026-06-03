import { Controller, Post, Body } from '@nestjs/common'
import { IsString, IsNotEmpty, IsOptional } from 'class-validator'
import { TranslateService } from './translate.service'

class TranslateDto {
  @IsString()
  @IsNotEmpty()
  text!: string

  @IsString()
  @IsNotEmpty()
  to!: string

  @IsOptional()
  @IsString()
  from?: string
}

@Controller('translate')
export class TranslateController {
  constructor(private translateSvc: TranslateService) {}

  @Post()
  async translate(@Body() dto: TranslateDto) {
    const translated = await this.translateSvc.translate(dto.text, dto.to, dto.from || 'pt')
    return { translated }
  }
}
