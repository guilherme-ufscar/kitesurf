import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from '../../prisma/prisma.service'
import { PaymentType } from '@kite360/shared'

@Injectable()
export class PaymentsService {
  private mp: any = null

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {
    const accessToken = config.get('MERCADOPAGO_ACCESS_TOKEN')
    if (accessToken) {
      import('mercadopago').then(({ default: MercadoPago }) => {
        this.mp = new MercadoPago({ accessToken })
      })
    }
  }

  async createFeaturedPayment(userId: string, listingId: string, days: number) {
    const prices: Record<number, number> = { 7: 29.9, 15: 49.9, 30: 89.9 }
    const amount = prices[days] || 29.9

    if (!this.mp) {
      // Modo demo - sem Mercado Pago configurado
      const payment = await this.prisma.payment.create({
        data: {
          userId,
          listingId,
          type: PaymentType.FEATURED,
          amount,
          status: 'PENDING',
          metadata: { days, demo: true },
        },
      })
      return { checkoutUrl: null, preferenceId: payment.id, demo: true }
    }

    const { Preference } = await import('mercadopago')
    const preference = new Preference(this.mp)
    const result = await preference.create({
      body: {
        items: [{ title: `Destaque do anúncio por ${days} dias`, quantity: 1, unit_price: amount }],
        metadata: { userId, listingId, type: PaymentType.FEATURED, days },
        back_urls: {
          success: `${this.config.get('API_URL')}/api/v1/payments/success`,
          failure: `${this.config.get('API_URL')}/api/v1/payments/failure`,
        },
        notification_url: `${this.config.get('API_URL')}/api/v1/payments/webhook`,
      },
    })

    await this.prisma.payment.create({
      data: {
        userId,
        listingId,
        type: PaymentType.FEATURED,
        amount,
        mercadopagoId: result.id,
        metadata: { days },
      },
    })

    return { checkoutUrl: result.init_point, preferenceId: result.id }
  }

  async handleWebhook(body: any) {
    if (body.type !== 'payment') return

    const payment = await this.prisma.payment.findFirst({
      where: { mercadopagoId: body.data?.id },
    })
    if (!payment) return

    const metadata = payment.metadata as any

    if (body.action === 'payment.updated' && payment.type === PaymentType.FEATURED) {
      const days = metadata?.days || 7
      const featuredUntil = new Date()
      featuredUntil.setDate(featuredUntil.getDate() + days)

      await Promise.all([
        this.prisma.payment.update({
          where: { id: payment.id },
          data: { status: 'APPROVED' },
        }),
        payment.listingId
          ? this.prisma.listing.update({
              where: { id: payment.listingId },
              data: { isFeatured: true, featuredUntil },
            })
          : Promise.resolve(),
      ])
    }
  }
}
