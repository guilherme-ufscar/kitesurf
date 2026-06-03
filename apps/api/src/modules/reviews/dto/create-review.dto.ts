import { IsString, IsNumber, IsOptional, Min, Max, IsUUID } from 'class-validator'

export class CreateReviewDto {
  @IsUUID()
  reviewedId: string

  @IsUUID()
  listingId: string

  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number

  @IsOptional()
  @IsString()
  comment?: string

  @IsString()
  type: string
}
