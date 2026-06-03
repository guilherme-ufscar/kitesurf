import {
  IsString, IsNumber, IsEnum, IsOptional, IsArray, IsUrl, Min, MaxLength, IsNotEmpty,
} from 'class-validator'
import { Condition, ListingStatus, Modality } from '@kite360/shared'

export class CreateListingDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title!: string

  @IsOptional()
  description?: any

  @IsNumber()
  @Min(0)
  price!: number

  @IsEnum(Condition)
  condition!: Condition

  @IsEnum(Modality)
  modality!: Modality

  @IsString()
  @IsNotEmpty()
  city!: string

  @IsString()
  @IsNotEmpty()
  state!: string

  @IsOptional()
  @IsString()
  categoryId?: string

  @IsOptional()
  @IsString()
  brandId?: string

  @IsOptional()
  @IsNumber()
  year?: number

  @IsOptional()
  @IsString()
  size?: string

  @IsOptional()
  @IsUrl()
  youtubeUrl?: string

  @IsOptional()
  @IsEnum(ListingStatus)
  status?: ListingStatus

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imageIds?: string[]
}
