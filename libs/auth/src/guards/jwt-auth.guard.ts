import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  UnauthorizedException,
  BadRequestException
} from '@nestjs/common';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('JwtAuthGuard initialized');
    const rpcContext = context.switchToRpc();
    const requestData = rpcContext.getData();
    console.log(requestData);
    try {
      const token = this.extractToken(requestData);
      console.log('Token:', token);
      if (!token) {
        throw new BadRequestException('Authorization token is missing');
      }

      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
        ignoreExpiration: false
      });

      requestData.user = payload;

      return true;

    } catch (error) {
      // Transforma errores de JWT a excepciones compatibles con el filtro
      switch (error.name) {
        case 'TokenExpiredError':
          throw new UnauthorizedException('Token expired');

        case 'JsonWebTokenError':
          throw new BadRequestException('Invalid token format');

        default:
          throw new UnauthorizedException('Authentication failed');
      }
    }
  }

  private extractToken(requestData: any): string | null {
    // 1. Token directo
    if (requestData?.token) return requestData.token;

    // 2. Header Authorization
    const authHeader = requestData?.authorization || requestData?.headers?.authorization;
    if (authHeader) {
      const [type, token] = authHeader.split(' ');
      return type === 'Bearer' ? token : authHeader;
    }

    return null;
  }
}