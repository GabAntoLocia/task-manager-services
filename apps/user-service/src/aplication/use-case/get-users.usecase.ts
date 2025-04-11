import { Injectable } from '@nestjs/common';
import { UserPrismaRepository } from '../../infrastructure/prisma/user.repository';
import { UserResponseDto } from '../dto/user-response.dto';

@Injectable()
export class GetUsersUseCase {
    constructor(private readonly userRepository: UserPrismaRepository) { }

    async execute(): Promise<UserResponseDto[]> {
        const users = await this.userRepository.findAll();

        console.log(users);
        return users.map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt
        }));
    }
}