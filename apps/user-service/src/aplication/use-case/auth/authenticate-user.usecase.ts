import { Injectable, UnauthorizedException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { GenerateTokensUseCase } from './generate-token-usecase';
import { IUserRepository } from '../../../domain/interfaces/user-repository.interface';


@Injectable()
export class AuthenticateUserUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly generateTokens: GenerateTokensUseCase
  ) { }

  async execute(
    email: string,
    password: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {

      // Buscar usuario
      const user = await this.userRepo.findByEmail(email);
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Verificar contraseña
      const isPasswordValid = await this.verifyPassword(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }


      const tokens = await this.generateTokens.execute(user.id);

      await this.updateUserRefreshToken(user.id, tokens.refreshToken);

      return tokens;

    } catch (error) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      console.error(`Authentication error for email: ${email}`, error);

      throw new InternalServerErrorException('Authentication service unavailable');
    }
  }

  private async verifyPassword(
    plainText: string,
    hashed: string
  ): Promise<boolean> {
    try {
      return await compare(plainText, hashed);
    } catch (error) {
      console.error('Password verification error:', error);
      throw new InternalServerErrorException('Password verification failed');
    }
  }

  private async updateUserRefreshToken(
    userId: string,
    refreshToken: string
  ): Promise<void> {
    try {
      const hashedToken = await hash(refreshToken, 10);
      await this.userRepo.updateRefreshToken(userId, hashedToken);
    } catch (error) {
      console.error('Refresh token update error:', error);
      throw new InternalServerErrorException('Could not update session data');
    }
  }
}