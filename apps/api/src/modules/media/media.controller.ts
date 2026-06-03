import {
  Controller, Post, Delete, Param, UploadedFile, UseInterceptors, UseGuards, Request,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { AuthGuard } from '@nestjs/passport'
import { MediaService } from './media.service'

@Controller('media')
@UseGuards(AuthGuard('jwt'))
export class MediaController {
  constructor(private media: MediaService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file: Express.Multer.File, @Request() req: any) {
    return this.media.processAndSave(req.user.id, file)
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.media.deleteMedia(id)
  }
}
