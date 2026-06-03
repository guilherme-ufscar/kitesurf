import { IsString, IsNumber, IsOptional, Min, Max, IsUUID, IsNotEmpty } from 'class-validator'

export class CreateReviewDto {
  @IsUUID()
  @IsNotEmpty()
  reviewedId!: string

  @IsUUID()
  @IsNotEmpty()
  listingId!: string

  @IsNumber()
  @Min(1)
  @Max(5)
  rating!: number

  @IsOptional()
  @IsString()
  comment?: string

  @IsString()
  @IsNotEmpty()
  type!: string
}
