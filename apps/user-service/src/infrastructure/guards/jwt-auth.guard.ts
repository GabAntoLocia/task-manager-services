import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = context.switchToHttp().getRequest();
    const authHeader = ctx.headers['authorization'];
    const token = authHeader?.replace('Bearer ', '');
    const data = context.switchToRpc().getData();
    // console.log('data', data);
    console.log('data', data?.authorization);
    // const token = data?.token || data?.authorization?.replace('Bearer ', '');
    console.log('token', token);
    if (!token) {
      throw new UnauthorizedException('Token no proporcionado');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET || 'supersecret',
      });

      data.user = payload;
      return true;
    } catch (err) {
      throw new UnauthorizedException('Token inválido');
    }
  }
}