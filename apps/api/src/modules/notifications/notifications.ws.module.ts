import { Module } from '@nestjs/common'
import { NotificationsGateway } from './notifications.gateway'
import { NotificationsModule } from './notifications.module'

@Module({
  imports: [NotificationsModule],
  providers: [NotificationsGateway],
  exports: [NotificationsModule],
})
export class NotificationsWsModule {}