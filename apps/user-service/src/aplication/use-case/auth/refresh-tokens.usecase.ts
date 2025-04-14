import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  InternalServerErrorException,
  Logger,
  BadRequestException
} from '@nestjs/common';
import { IUserRepository } from '../../../domain/interfaces/user-repository.interface';
import { GenerateTokensUseCase } from './generate-token-usecase';

@Injectable()
export class RefreshTokensUseCase {
  private readonly logger = new Logger(RefreshTokensUseCase.name);

  constructor(
    private readonly userRepo: IUserRepository,
    private readonly generateTokens: GenerateTokensUseCase,
  ) { }

  async execute(
    userId: string,
    refreshToken: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
     
      if (!userId || !refreshToken) {
        throw new BadRequestException('User ID and refresh token are required');
      }

      // Obtener usuario
      const user = await this.userRepo.findById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      if (!user.hashedRefreshToken) {
        throw new UnauthorizedException('No refresh token associated with user');
      }

      // Validar token
      const isMatch = await bcrypt.compare(refreshToken, user.hashedRefreshToken);
      if (!isMatch) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Generar nuevos tokens
      const tokens = await this.generateTokens.execute(user.id);

      // Hashear y almacenar nuevo refresh token
      const hashed = await bcrypt.hash(tokens.refreshToken, 10);
      await this.userRepo.updateRefreshToken(user.id, hashed);

      return tokens;
    } catch (error) {
      this.logger.error(`Error refreshing tokens for user ${userId}`, error.stack);


      if (error instanceof NotFoundException ||
        error instanceof UnauthorizedException ||
        error instanceof BadRequestException) {
        throw error;
      }

      // Encapsular errores desconocidos
      throw new InternalServerErrorException('Failed to refresh tokens', {
        cause: error
      });
    }
  }
}