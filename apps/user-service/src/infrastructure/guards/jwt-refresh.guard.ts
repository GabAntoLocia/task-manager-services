import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  
  @Injectable()
  export class JwtRefreshGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const ctx = context.switchToRpc();
      const requestData = ctx.getData();
  
      const token = requestData?.refreshToken;
      if (!token) {
        throw new UnauthorizedException('Refresh token no proporcionado');
      }
  
      try {
        const payload = await this.jwtService.verifyAsync(token, {
          secret: process.env.JWT_REFRESH_SECRET || 'superrefreshsecret',
        });
  
        // Guardar en el requestData para que los decoradores puedan acceder
        requestData.user = payload;
        requestData.refreshToken = token;
  
        return true;
      } catch (err) {
        throw new UnauthorizedException('Refresh token inválido o expirado');
      }
    }
  }