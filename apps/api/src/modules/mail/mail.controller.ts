import { Controller, Post, Body } from '@nestjs/common'
import { MailService } from './mail.service'

@Controller('mail')
export class MailController {
  constructor(private mail: MailService) {}

  @Post('send')
  async send(@Body() body: { to: string; subject: string; html: string }) {
    return this.mail.sendEmail(body.to, body.subject, body.html)
  }

  @Post('welcome')
  async sendWelcome(@Body() body: { to: string; name: string }) {
    return this.mail.sendWelcomeEmail(body.to, body.name)
  }

  @Post('reset-password')
  async sendResetPassword(@Body() body: { to: string; resetToken: string }) {
    return this.mail.sendPasswordResetEmail(body.to, body.resetToken)
  }
}