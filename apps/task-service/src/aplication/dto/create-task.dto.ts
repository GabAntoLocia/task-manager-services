import {
    IsString,
    IsNotEmpty,
    MinLength,
    MaxLength,
    IsEnum,
    IsDateString,
    IsUUID,
    IsOptional,
    NotContains,
    Matches
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

import { ApiProperty } from '@nestjs/swagger';
import { sanitizeHtml } from 'common/utils/sanitize-html';
import { TaskPriority, TaskStatus } from '../../domain/entities/task.entity';


export class CreateTaskDto {
    @ApiProperty({
        example: 'Implementar validaciones OWASP',
        description: 'Título de la tarea',
        required: true
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(3, {
        message: 'El título debe tener al menos 3 caracteres'
    })
    @MaxLength(100, {
        message: 'El título no puede exceder los 100 caracteres'
    })
    @NotContains('<', {
        message: 'El título no puede contener caracteres HTML'
    })
    @NotContains('>', {
        message: 'El título no puede contener caracteres HTML'
    })
    @Matches(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s.,;:()¿?¡!-]+$/, {
        message: 'El título contiene caracteres no permitidos'
    })
    @Transform(({ value }) => value.trim())
    title: string;

    @ApiProperty({
        example: 'Implementar validaciones según OWASP Top 10 para el DTO de tareas',
        description: 'Descripción detallada de la tarea',
        required: false
    })
    @IsOptional()
    @IsString()
    @MaxLength(500, {
        message: 'La descripción no puede exceder los 500 caracteres'
    })
    @Transform(({ value }) => sanitizeHtml(value)) // Sanitiza HTML
    @Transform(({ value }) => value?.trim())
    description?: string;

    @ApiProperty({
        enum: ['LOW', 'MEDIUM', 'HIGH'],
        example: 'MEDIUM',
        description: 'Prioridad de la tarea',
        required: true
    })
    @IsEnum(['LOW', 'MEDIUM', 'HIGH'],)
    @IsNotEmpty()
    priority: TaskPriority;

    @ApiProperty({
        enum: ['PENDING', 'COMPLETED'],
        example: 'PENDING',
        description: 'Estado de la tarea',
        required: false,
        default: 'PENDING'
    })
    @IsOptional()
    @IsEnum(['PENDING', 'COMPLETED'])
    status: TaskStatus;

    @ApiProperty({
        example: '2023-12-31T23:59:59.999Z',
        description: 'Fecha de creación en ISO8601',
        required: false
    })
    @IsOptional()
    @IsDateString()
    createdAt?: Date;

    @ApiProperty({
        example: '2023-12-31T23:59:59.999Z',
        description: 'Fecha de actualización en ISO8601',
        required: false
    })
    @IsOptional()
    @IsDateString()
    updatedAt?: Date;

    @ApiProperty({
        example: '550e8400-e29b-41d4-a716-446655440000',
        description: 'ID del usuario dueño de la tarea',
        required: true
    })
    @IsUUID(4, {
        message: 'El ID de usuario debe ser un UUID v4 válido'
    })
    @IsNotEmpty()
    userId: string;

    @ApiProperty({
        example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        description: 'Token de autorización JWT',
        required: false
    })
    @IsOptional()
    @IsString()
    @Matches(/^Bearer\s.+$/, {
        message: 'El token debe estar en formato Bearer'
    })
    authorization?: string;
}

