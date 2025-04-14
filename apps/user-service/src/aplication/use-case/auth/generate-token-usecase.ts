import { JwtService } from '@nestjs/jwt';
import { Injectable, Logger } from '@nestjs/common';
import { 
  BadRequestException,
  InternalServerErrorException 
} from '@nestjs/common';

@Injectable()
export class GenerateTokensUseCase {
  private readonly logger = new Logger(GenerateTokensUseCase.name);

  constructor(private readonly jwtService: JwtService) {}

  async execute(userId: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      if (!userId) {
        throw new BadRequestException('User ID is required');
      }

      const payload = { sub: userId };

      const [accessToken, refreshToken] = await Promise.all([
        this.jwtService.signAsync(payload, {
          expiresIn: '15m',
        }),
        this.jwtService.signAsync(payload, {
          expiresIn: '7d',
        }),
      ]);

      if (!accessToken || !refreshToken) {
        throw new InternalServerErrorException('Failed to generate tokens');
      }

      return { accessToken, refreshToken };
    } catch (error) {
      this.logger.error(`Error generating tokens for user ${userId}`, error.stack);

      if (error instanceof BadRequestException || error instanceof InternalServerErrorException) {
        throw error;
      }

      throw new InternalServerErrorException('Could not generate authentication tokens', {
        cause: error,
      });
    }
  }
}