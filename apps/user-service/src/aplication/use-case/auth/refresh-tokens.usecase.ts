import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { IUserRepository } from '../../../domain/interfaces/user-repository.interface';
import { GenerateTokensUseCase } from './generate-token-usecase';

export class RefreshTokensUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly generateTokens: GenerateTokensUseCase,
  ) {}

  async execute(userId: string, refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.userRepo.findById(userId);
    if (!user || !user.hashedRefreshToken) throw new Error('Usuario o token no válido');

    const isMatch = await bcrypt.compare(refreshToken, user.hashedRefreshToken);
    if (!isMatch) throw new Error('Token inválido');

    const tokens = await this.generateTokens.execute(user.id);
    const hashed = await bcrypt.hash(tokens.refreshToken, 10);
    await this.userRepo.updateRefreshToken(user.id, hashed);

    return tokens;
  }
}