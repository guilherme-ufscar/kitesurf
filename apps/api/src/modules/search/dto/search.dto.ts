import { IsOptional, IsString, IsNumber, IsEnum, IsBoolean, Min } from 'class-validator'
import { Transform, Type } from 'class-transformer'
import { Condition, Modality } from '@kite360/shared'

export class SearchDto {
  @IsOptional()
  @IsString()
  q?: string

  @IsOptional()
  @IsString()
  category?: string

  @IsOptional()
  @IsString()
  brand?: string

  @IsOptional()
  @IsEnum(Modality)
  modality?: Modality

  @IsOptional()
  @IsEnum(Condition)
  condition?: string

  @IsOptional()
  @IsString()
  state?: string

  @IsOptional()
  @IsString()
  city?: string

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxPrice?: number

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  featured?: boolean

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number
}
