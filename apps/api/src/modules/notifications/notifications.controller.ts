import { Controller, Get, Post, Patch, Param, UseGuards, Request } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { NotificationsService } from './notifications.service'

@Controller('notifications')
@UseGuards(AuthGuard('jwt'))
export class NotificationsController {
  constructor(private notifications: NotificationsService) {}

  @Get()
  findAll(@Request() req: any) {
    return this.notifications.findByUser(req.user.id)
  }

  @Get('unread-count')
  getUnreadCount(@Request() req: any) {
    return this.notifications.getUnreadCount(req.user.id)
  }

  @Post(':id/read')
  markAsRead(@Param('id') id: string, @Request() req: any) {
    return this.notifications.markAsRead(id, req.user.id)
  }

  @Post('read-all')
  markAllAsRead(@Request() req: any) {
    return this.notifications.markAllAsRead(req.user.id)
  }
}