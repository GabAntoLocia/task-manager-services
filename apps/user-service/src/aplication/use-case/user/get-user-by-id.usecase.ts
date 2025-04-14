import { NotFoundException } from "@nestjs/common";
import { UserPrismaRepository } from "../../../../prisma/user.repository";
import { User } from "../../../domain/entities/user.entity";
import { UserResponseDto } from "../../dto/user-response.dto";

export class GetUserByIdUseCase {
    constructor(private readonly userRepository: UserPrismaRepository) { }
    c

    async execute(id: string): Promise<UserResponseDto> {
        console.log(id);
        const user = await this.userRepository.findById(id);
        console.log(user);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        return new UserResponseDto(user);
    }
}