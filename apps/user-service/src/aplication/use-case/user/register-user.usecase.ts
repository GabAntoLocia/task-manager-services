import { Injectable, ConflictException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { User } from '../../../domain/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { IUserRepository } from '../../../domain/interfaces/user-repository.interface';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateUserDto } from '../../dto/create-user.dto';

@Injectable()
export class RegisterUserUseCase {
  constructor(private readonly userRepo: IUserRepository) {}

  async execute(input: { 
    name: string; 
    email: string; 
    password: string 
  }): Promise<User> {
    try { 


      //  Verificar si el usuario ya existe
      const existing = await this.userRepo.findByEmail(input.email);
      if (existing) {
        console.log('User already exists:', existing);
        throw new ConflictException('Email already registered');
      }

      // 3. Hash de la contraseña
      const hashedPassword = await bcrypt.hash(input.password, 10);

      // 4. Crear entidad de dominio
      const user = new User(
        crypto.randomUUID(),
        input.name,
        input.email,
        hashedPassword,
        new Date(),
        new Date()
      );

      //Validar el DTO de entrada (input)
      const userInstance = plainToInstance(CreateUserDto, user);
      const errors = await validate(userInstance);
      if (errors.length > 0) {
        console.error('Validation errors:', errors);
        const errorMessages = this.formatValidationErrors(errors);
        throw new BadRequestException(`Validation failed: ${errorMessages}`);
      }

    
      return await this.userRepo.create(user);

    } catch (error) {
      // Re-lanzar excepciones conocidas
      console.error('Error during user registration:', error);
      if (
        error instanceof ConflictException || 
        error instanceof BadRequestException
      ) {
        throw error;
      }

      // Convertir errores desconocidos
      throw new InternalServerErrorException('Failed to register user', {
        cause: error,
      });
    }
  }

  private formatValidationErrors(errors: any[]): string {
    return errors
      .map(err => {
        return Object.values(err.constraints).join(', ');
      })
      .join('; ');
  }
}