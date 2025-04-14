import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, MaxLength } from 'class-validator';

export class LoginUserDto {

  @ApiProperty({
    example: 'usuario@example.com',
    description: 'Correo electrónico válido',
  })
  @IsEmail({}, { message: 'Debe proporcionar un correo electrónico válido' })
  @MaxLength(100, { message: 'El correo electrónico no puede exceder los 100 caracteres' })
  @IsNotEmpty({ message: 'El correo electrónico no puede estar vacío' })
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
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  password: string;
}