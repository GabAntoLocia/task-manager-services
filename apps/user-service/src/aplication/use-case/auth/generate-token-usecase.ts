import { JwtService } from '@nestjs/jwt';

export class GenerateTokensUseCase {
  constructor(private readonly jwtService: JwtService) {}

  async execute(userId: string): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { sub: userId };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
      }),
    ]);

    return { accessToken, refreshToken };
  }
}