import { Injectable } from '@nestjs/common'
import { join, basename, extname } from 'path'
import * as sharp from 'sharp'
import * as fs from 'fs/promises'
import { PrismaService } from '../../prisma/prisma.service'

const SIZES = {
  original: 1200,
  medium: 600,
  thumb: 150,
}

@Injectable()
export class MediaService {
  constructor(private prisma: PrismaService) {}

  async processAndSave(userId: string, file: Express.Multer.File) {
    const uploadDir = process.env.UPLOAD_DIR || '/app/uploads'
    const id = basename(file.filename, extname(file.filename))

    const [webpMeta] = await Promise.all([
      sharp(file.path)
        .resize(SIZES.original, SIZES.original, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 85 })
        .toFile(join(uploadDir, `${id}.webp`)),
      sharp(file.path)
        .resize(SIZES.medium, SIZES.medium, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(join(uploadDir, `${id}_md.webp`)),
      sharp(file.path)
        .resize(SIZES.thumb, SIZES.thumb, { fit: 'cover' })
        .webp({ quality: 75 })
        .toFile(join(uploadDir, `${id}_th.webp`)),
    ])

    await fs.unlink(file.path).catch(() => null)

    const media = await this.prisma.media.create({
      data: {
        userId,
        filename: `${id}.webp`,
        originalPath: file.path,
        webpUrl: `/uploads/${id}.webp`,
        mediumUrl: `/uploads/${id}_md.webp`,
        thumbUrl: `/uploads/${id}_th.webp`,
        width: webpMeta.width || 0,
        height: webpMeta.height || 0,
        sizeBytes: file.size,
      },
    })

    return media
  }

  async deleteMedia(id: string) {
    const media = await this.prisma.media.findUnique({ where: { id } })
    if (!media) return

    const uploadDir = process.env.UPLOAD_DIR || '/app/uploads'
    const base = basename(media.filename, '.webp')

    await Promise.all([
      fs.unlink(join(uploadDir, `${base}.webp`)).catch(() => null),
      fs.unlink(join(uploadDir, `${base}_md.webp`)).catch(() => null),
      fs.unlink(join(uploadDir, `${base}_th.webp`)).catch(() => null),
    ])

    await this.prisma.media.delete({ where: { id } })
  }
}
