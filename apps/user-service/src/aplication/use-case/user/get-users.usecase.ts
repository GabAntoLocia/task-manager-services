import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UserResponseDto } from '../../dto/user-response.dto';
import { IUserRepository } from '../../../domain/interfaces/user-repository.interface';

@Injectable()
export class GetUsersUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(): Promise<UserResponseDto[]> {
    try {
   
      const users = await this.userRepository.findAll();

      // Validar que existan usuarios
      if (!users || users.length === 0) {
        return [];
      }


      return users.map(user => this.toUserResponseDto(user));

    } catch (error) {
      // Manejo de errores específicos
      throw new InternalServerErrorException('Failed to retrieve users', {
        cause: error,
      });
    }
  }

  private toUserResponseDto(user: any): UserResponseDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      // Excluir información sensible como password
    };
  }
}