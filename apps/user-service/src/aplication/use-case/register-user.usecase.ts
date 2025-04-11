import { User } from '../../domain/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UserPrismaRepository } from '../../infrastructure/prisma/user.repository';
import { IUserRepository } from '../../domain/interfaces/user-repository.interface';

export class RegisterUserUseCase {
    constructor(private readonly userRepo: IUserRepository) { }

    async execute(input: { name: string; email: string; password: string }): Promise<User> {
        const existing = await this.userRepo.findByEmail(input.email);
        if (existing) throw new Error('Email ya registrado');

        const hashedPassword = await bcrypt.hash(input.password, 10);
        const user = new User(
            crypto.randomUUID(),
            input.name,
            input.email,
            hashedPassword,
            new Date(),
            new Date()
        );

        return this.userRepo.create(user);
    }
}
