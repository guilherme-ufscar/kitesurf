import { Controller, Post, Body, UseGuards, Request, HttpCode } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { PaymentsService } from './payments.service'

@Controller('payments')
export class PaymentsController {
  constructor(private payments: PaymentsService) {}

  @Post('feature-listing')
  @UseGuards(AuthGuard('jwt'))
  featureListing(
    @Request() req: any,
    @Body() body: { listingId: string; days: number },
  ) {
    return this.payments.createFeaturedPayment(req.user.id, body.listingId, body.days)
  }

  @Post('webhook')
  @HttpCode(200)
  webhook(@Body() body: any) {
    return this.payments.handleWebhook(body)
  }
}
