import { Injectable } from '@nestjs/common'
import { Resend } from 'resend'

@Injectable()
export class MailService {
  private resend: Resend | null = null
  private fromEmail: string

  constructor() {
    const apiKey = process.env.RESEND_API_KEY
    this.fromEmail = process.env.EMAIL_FROM || 'noreply@kite360.com.br'

    if (apiKey) {
      this.resend = new Resend(apiKey)
    }
  }

  async sendEmail(to: string, subject: string, html: string) {
    if (!this.resend) {
      console.log(`[Email] Would send to ${to}: ${subject}`)
      return { success: true, mock: true }
    }

    try {
      const result = await this.resend.emails.send({
        from: this.fromEmail,
        to,
        subject,
        html,
      })
      return { success: true, data: result }
    } catch (error) {
      console.error('Failed to send email:', error)
      return { success: false, error }
    }
  }

  async sendWelcomeEmail(to: string, name: string) {
    return this.sendEmail(
      to,
      'Bem-vindo ao KITE360º!',
      `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #141F2E; padding: 20px; text-align: center;">
            <h1 style="color: #286B72; margin: 0;">KITE360º</h1>
          </div>
          <div style="padding: 30px;">
            <h2 style="color: #141F2E;">Olá, ${name}!</h2>
            <p style="color: #333; line-height: 1.6;">
              Seja muito bem-vindo ao KITE360º, o marketplace definitivo para equipamentos de kitesurf, wingfoil e esportes aquáticos.
            </p>
            <p style="color: #333; line-height: 1.6;">
              Sua conta foi criada com sucesso. Agora você pode:
            </p>
            <ul style="color: #333;">
              <li>Publicar anúncios de seus equipamentos</li>
              <li>Buscar equipamentos de kitesurf, wingfoil e mais</li>
              <li>Entrar em contato direto com vendedores</li>
              <li>Avaliar vendedores e compradores</li>
            </ul>
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:10209'}/busca"
                 style="background: #286B72; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">
                Explorar Anúncios
              </a>
            </div>
          </div>
          <div style="background: #F4F7F8; padding: 15px; text-align: center; font-size: 12px; color: #666;">
            KITE360º — O marketplace dos esportes aquáticos
          </div>
        </div>
      `
    )
  }

  async sendPasswordResetEmail(to: string, resetToken: string) {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:10209'}/recuperar-senha?token=${resetToken}`

    return this.sendEmail(
      to,
      'Recuperação de senha - KITE360º',
      `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #141F2E; padding: 20px; text-align: center;">
            <h1 style="color: #286B72; margin: 0;">KITE360º</h1>
          </div>
          <div style="padding: 30px;">
            <h2 style="color: #141F2E;">Recuperação de Senha</h2>
            <p style="color: #333; line-height: 1.6;">
              Você solicitou a recuperação de senha da sua conta no KITE360º.
            </p>
            <p style="color: #333; line-height: 1.6;">
              Clique no botão abaixo para criar uma nova senha. Este link expira em 1 hora.
            </p>
            <div style="text-align: center; margin-top: 30px;">
              <a href="${resetUrl}"
                 style="background: #286B72; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">
                Redefinir Senha
              </a>
            </div>
            <p style="color: #666; font-size: 12px; margin-top: 30px;">
              Se você não solicitou esta recuperação, ignore este email.
            </p>
          </div>
          <div style="background: #F4F7F8; padding: 15px; text-align: center; font-size: 12px; color: #666;">
            KITE360º — O marketplace dos esportes aquáticos
          </div>
        </div>
      `
    )
  }

  async sendNewMessageNotification(to: string, senderName: string, listingTitle: string) {
    return this.sendEmail(
      to,
      `Nova mensagem de ${senderName} - KITE360º`,
      `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #141F2E; padding: 20px; text-align: center;">
            <h1 style="color: #286B72; margin: 0;">KITE360º</h1>
          </div>
          <div style="padding: 30px;">
            <h2 style="color: #141F2E;">Você recebeu uma nova mensagem!</h2>
            <p style="color: #333; line-height: 1.6;">
              <strong>${senderName}</strong> enviou uma mensagem sobre o anúncio:
            </p>
            <div style="background: #F4F7F8; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <strong style="color: #286B72;">${listingTitle}</strong>
            </div>
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:10209'}/mensagens"
                 style="background: #286B72; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block;">
                Ver Mensagens
              </a>
            </div>
          </div>
          <div style="background: #F4F7F8; padding: 15px; text-align: center; font-size: 12px; color: #666;">
            KITE360º — O marketplace dos esportes aquáticos
          </div>
        </div>
      `
    )
  }
}