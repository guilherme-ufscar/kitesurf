import { Module } from '@nestjs/common'
import { MulterModule } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname, join } from 'path'
import { v4 as uuid } from 'uuid'
import { MediaController } from './media.controller'
import { MediaService } from './media.service'

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: (req, file, cb) => {
          cb(null, process.env.UPLOAD_DIR || '/app/uploads')
        },
        filename: (req, file, cb) => {
          cb(null, `${uuid()}${extname(file.originalname)}`)
        },
      }),
      fileFilter: (req, file, cb) => {
        const allowed = /\.(jpg|jpeg|png|webp)$/i
        cb(null, allowed.test(file.originalname))
      },
      limits: { fileSize: Number(process.env.MAX_FILE_SIZE_BYTES) || 10485760 },
    }),
  ],
  controllers: [MediaController],
  providers: [MediaService],
  exports: [MediaService],
})
export class MediaModule {}
