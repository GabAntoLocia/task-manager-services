import { compare } from "bcrypt";
import * as bcrypt from "bcrypt";
import { GenerateTokensUseCase } from "./generate-token-usecase";
import { UserPrismaRepository } from "../../../infrastructure/prisma/user.repository";


export class AuthenticateUserUseCase {
  constructor(
    private readonly userRepo: UserPrismaRepository,
    private readonly generateTokens: GenerateTokensUseCase
  ) { }

  async execute(email: string, password: string): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.userRepo.findByEmail(email);
    if (!user) throw new Error('Usuario no encontrado');

    const isMatch = await compare(password, user.password);
    if (!isMatch) throw new Error('Credenciales inválidas');

    const tokens = await this.generateTokens.execute(user.id);
    const hashed = await bcrypt.hash(tokens.refreshToken, 10);
    await this.userRepo.updateRefreshToken(user.id, hashed);

    return tokens;
  }
}