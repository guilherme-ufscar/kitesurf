import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { AdminController } from './admin.controller'
import { AdminService } from './admin.service'
import { AdminGuard } from './admin.guard'
import { PrismaModule } from '../../prisma/prisma.module'

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({}),
  ],
  controllers: [AdminController],
  providers: [AdminService, AdminGuard],
})
export class AdminModule {}