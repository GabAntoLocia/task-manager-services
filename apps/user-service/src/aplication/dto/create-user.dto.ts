import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  Matches,
  IsNotEmpty,
  IsStrongPassword
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';


export class CreateUserDto {
  @ApiProperty({
    example: 'usuario123',
    description: 'Nombre de usuario único',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(4, { message: 'El nombre de usuario debe tener al menos 4 caracteres' })
  @MaxLength(20, { message: 'El nombre de usuario no puede exceder los 20 caracteres' })
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'El nombre de usuario solo puede contener letras, números y guiones bajos',
  })
  name: string;

  @ApiProperty({
    example: 'usuario@example.com',
    description: 'Correo electrónico válido',
  })
  @IsEmail({}, { message: 'Debe proporcionar un correo electrónico válido' })
  @MaxLength(100, { message: 'El correo electrónico no puede exceder los 100 caracteres' })
  email: string;

  @ApiProperty({
    example: 'P@ssw0rd123!',
    description: 'Contraseña segura',
  })
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  }, {
    message: 'La contraseña debe tener al menos 8 caracteres, incluyendo 1 mayúscula, 1 minúscula, 1 número y 1 símbolo'
  })
  password: string;
}