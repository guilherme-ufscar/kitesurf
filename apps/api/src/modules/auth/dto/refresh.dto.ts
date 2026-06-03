import { IsString, IsUUID, IsNotEmpty } from 'class-validator'

export class RefreshDto {
  @IsUUID()
  @IsNotEmpty()
  userId!: string

  @IsString()
  @IsNotEmpty()
  refreshToken!: string
}
