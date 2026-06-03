import { Controller, Get } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'

@Controller('sitemap')
export class SitemapController {
  constructor(private prisma: PrismaService) {}

  @Get('index.xml')
  async getSitemap() {
    const baseUrl = process.env.API_URL || 'https://kite360.com.br'

    // Get all active listings
    const listings = await this.prisma.listing.findMany({
      where: { status: 'ACTIVE' },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: 'desc' },
      take: 1000,
    })

    const now = new Date().toISOString()

    const sitemapEntries = [
      { loc: `${baseUrl}/`, lastmod: null, changefreq: 'daily', priority: '1.0' },
      { loc: `${baseUrl}/busca`, lastmod: null, changefreq: 'daily', priority: '0.8' },
      { loc: `${baseUrl}/cadastro`, lastmod: null, changefreq: 'monthly', priority: '0.5' },
      ...listings.map((l) => ({
        loc: `${baseUrl}/anuncio/${l.slug}`,
        lastmod: new Date(l.updatedAt).toISOString().split('T')[0],
        changefreq: 'weekly',
        priority: '0.7',
      })),
    ]

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    ${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`

    return {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'max-age=3600',
      },
      body: sitemap,
    }
  }
}