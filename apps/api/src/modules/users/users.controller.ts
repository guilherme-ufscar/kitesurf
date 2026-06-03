import { Controller, Get, Patch, Body, Param, UseGuards, Request } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { UsersService } from './users.service'
import { UpdateProfileDto } from './dto/update-profile.dto'

@Controller('users')
export class UsersController {
  constructor(private users: UsersService) {}

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  getMe(@Request() req: any) {
    return this.users.findById(req.user.id)
  }

  @Patch('me')
  @UseGuards(AuthGuard('jwt'))
  updateMe(@Request() req: any, @Body() dto: UpdateProfileDto) {
    return this.users.updateProfile(req.user.id, dto)
  }

  @Get(':id')
  getPublicProfile(@Param('id') id: string) {
    return this.users.findPublicProfile(id)
  }
}
