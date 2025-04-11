import { NotFoundException } from "@nestjs/common";
import { UserPrismaRepository } from "../../infrastructure/prisma/user.repository";
import { User } from "../../domain/entities/user.entity";
import { UserResponseDto } from "../dto/user-response.dto";

export class GetUserByIdUseCase {
    constructor(private readonly userRepository: UserPrismaRepository) { }

    async execute(id: string): Promise<UserResponseDto> {
        const user = await this.userRepository.findById(id);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return new UserResponseDto(user);
    }
}