import { IUserRepository } from "../../../domain/interfaces/user-repository.interface";

export class LogoutUserUseCase {
    constructor(private readonly userRepo: IUserRepository) {}
  
    async execute(userId: string): Promise<void> {
      await this.userRepo.removeRefreshToken(userId);
    }
  }