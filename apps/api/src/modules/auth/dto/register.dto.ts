import { IsEmail, IsString, MinLength, MaxLength, IsNotEmpty } from 'class-validator'

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  name!: string

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password!: string
}
