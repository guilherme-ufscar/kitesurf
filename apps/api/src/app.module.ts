import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from './prisma/prisma.module'
import { AuthModule } from './modules/auth/auth.module'
import { UsersModule } from './modules/users/users.module'
import { ListingsModule } from './modules/listings/listings.module'
import { MediaModule } from './modules/media/media.module'
import { SearchModule } from './modules/search/search.module'
import { ChatModule } from './modules/chat/chat.module'
import { ReviewsModule } from './modules/reviews/reviews.module'
import { PaymentsModule } from './modules/payments/payments.module'
import { TranslateModule } from './modules/translate/translate.module'
import { CommunitiesModule } from './modules/communities/communities.module'
import { NotificationsModule } from './modules/notifications/notifications.module'
import { AdminModule } from './modules/admin/admin.module'
import { SitemapModule } from './modules/sitemap/sitemap.module'
import { MailModule } from './modules/mail/mail.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ListingsModule,
    MediaModule,
    SearchModule,
    ChatModule,
    ReviewsModule,
    PaymentsModule,
    TranslateModule,
    CommunitiesModule,
    NotificationsModule,
    AdminModule,
    SitemapModule,
    MailModule,
  ],
})
export class AppModule {}
