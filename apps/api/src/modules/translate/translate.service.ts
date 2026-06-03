import { Injectable, Logger } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from '../../prisma/prisma.service'
import { createHash } from 'crypto'
import { firstValueFrom } from 'rxjs'

@Injectable()
export class TranslateService {
  private readonly logger = new Logger(TranslateService.name)

  constructor(
    private http: HttpService,
    private config: ConfigService,
    private prisma: PrismaService,
  ) {}

  async translate(text: string, targetLang: string, sourceLang = 'pt'): Promise<string> {
    if (sourceLang === targetLang) return text
    if (!text?.trim()) return text

    const textHash = createHash('sha256').update(text).digest('hex').slice(0, 32)

    const cached = await this.prisma.translationCache.findUnique({
      where: { textHash_sourceLang_targetLang: { textHash, sourceLang, targetLang } },
    })

    if (cached) {
      await this.prisma.translationCache.update({
        where: { id: cached.id },
        data: { hitCount: { increment: 1 } },
      })
      return cached.translatedText
    }

    const translated = await this.callLibreTranslate(text, sourceLang, targetLang)

    await this.prisma.translationCache.create({
      data: { textHash, sourceLang, targetLang, translatedText: translated },
    }).catch(() => null)

    return translated
  }

  private async callLibreTranslate(text: string, source: string, target: string): Promise<string> {
    try {
      const url = this.config.get('LIBRETRANSLATE_URL', 'http://libretranslate:5000')
      const apiKey = this.config.get('LIBRETRANSLATE_API_KEY', '')

      const response = await firstValueFrom(
        this.http.post(`${url}/translate`, {
          q: text,
          source,
          target,
          ...(apiKey ? { api_key: apiKey } : {}),
        }),
      )

      return response.data.translatedText || text
    } catch (err: any) {
      this.logger.warn(`Translation failed: ${err?.message || err}`)
      return text
    }
  }

  async translateBatch(texts: string[], targetLang: string, sourceLang = 'pt') {
    return Promise.all(texts.map((t) => this.translate(t, targetLang, sourceLang)))
  }
}
