import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { TranslateController } from './translate.controller'
import { TranslateService } from './translate.service'

@Module({
  imports: [HttpModule],
  controllers: [TranslateController],
  providers: [TranslateService],
  exports: [TranslateService],
})
export class TranslateModule {}
