import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const token = this.extractTokenFromHeader(request)

    if (!token) {
      throw new UnauthorizedException('Token não fornecido')
    }

    try {
      const payload = await this.jwtService.verifyAsync(token)

      // Check if user is admin (role-based or specific admin check)
      // For simplicity, we'll check for a specific admin email or add a role field
      // In production, you'd have a proper RBAC system
      const adminEmails = process.env.ADMIN_EMAILS?.split(',') || []
      const isAdmin = payload.role === 'admin' || adminEmails.includes(payload.email)

      if (!isAdmin) {
        throw new UnauthorizedException('Acesso restrito a administradores')
      }

      request.user = payload
      return true
    } catch {
      throw new UnauthorizedException('Token inválido ou expirado')
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}