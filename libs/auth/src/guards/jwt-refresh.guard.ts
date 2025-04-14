import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtRefreshGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const rpcContext = context.switchToRpc();
    const requestData = rpcContext.getData();

    try {
      const token = this.extractRefreshToken(requestData);
      if (!token) {
        throw new BadRequestException('Refresh token no proporcionado');
      }

      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_REFRESH_SECRET,
        ignoreExpiration: false
      });

      // Adjuntar información al request
      requestData.user = payload;
      requestData.refreshToken = token;

      return true;

    } catch (error) {
      // Transformar errores específicos de JWT
      switch (error.name) {
        case 'TokenExpiredError':
          throw new UnauthorizedException('Refresh token expirado');
        
        case 'JsonWebTokenError':
          throw new BadRequestException('Formato de refresh token inválido');
          
        default:
          throw new UnauthorizedException('Autenticación con refresh token fallida');
      }
    }
  }

  private extractRefreshToken(requestData: any): string | null {
    // 1. Campo directo refreshToken
    if (requestData?.refreshToken) {
      return requestData.refreshToken;
    }
    
    // 2. Encabezado Authorization
    const authHeader = requestData?.authorization || requestData?.headers?.authorization;
    if (authHeader) {
      const [type, token] = authHeader.split(' ');
      return type === 'Bearer' ? token : authHeader;
    }

    return null;
  }
}