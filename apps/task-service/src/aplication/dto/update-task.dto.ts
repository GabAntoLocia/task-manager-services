import {
    IsString,
    IsOptional,
    IsIn,
    MinLength,
    MaxLength,
    NotContains,
    Matches,
    IsEnum,
    ValidateIf
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import { sanitizeHtml } from 'common/utils/sanitize-html';


export enum TaskPriority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
}

export enum TaskStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
}

export class UpdateTaskDto {
    @ApiProperty({
        example: 'Actualizar validaciones OWASP',
        description: 'Nuevo título de la tarea',
        required: false
    })
    @IsOptional()
    @IsString()
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
    @Transform(({ value }) => value?.trim())
    @ValidateIf((o) => o.title !== undefined)
    title?: string;

    @ApiProperty({
        example: 'Actualizar validaciones según OWASP Top 10',
        description: 'Nueva descripción de la tarea',
        required: false
    })
    @IsOptional()
    @IsString()
    @MaxLength(500, {
        message: 'La descripción no puede exceder los 500 caracteres'
    })
    @Transform(({ value }) => sanitizeHtml(value))
    @Transform(({ value }) => value?.trim())
    @ValidateIf((o) => o.description !== undefined)
    description?: string;

    @ApiProperty({
        enum: ['LOW', 'MEDIUM', 'HIGH'],
        example: "LOW",
        description: 'Nueva prioridad de la tarea',
        required: false
    })
    @IsOptional()
    @IsEnum(TaskPriority, {
        message: `Priority must be one of: ${Object.values(TaskPriority).join(', ')}`,
    }
    )
    @ValidateIf((o) => o.priority !== undefined)
    priority?: TaskPriority;

    @ApiProperty({
        enum: ['PENDING', 'COMPLETED'],
        example: 'COMPLETED',
        description: 'Nuevo estado de la tarea',
        required: false
    })
    @IsOptional()
    @IsEnum(TaskStatus, {
        message: `Status must be one of: ${Object.values(TaskStatus).join(', ')}`,
    })
    @ValidateIf((o) => o.status !== undefined)
    status?: TaskStatus;

    @ApiProperty({
        example: '1234567890',
        description: 'ID del usuario propietario de la tarea',
        required: false
    })
    @IsOptional()
    @IsString()
    @MaxLength(36, {
        message: 'El ID de usuario no puede exceder los 36 caracteres'
    })
    @Transform(({ value }) => value?.trim())
    @ValidateIf((o) => o.userId !== undefined)
    @NotContains('<', {
        message: 'El ID de usuario no puede contener caracteres HTML'
    })
    @NotContains('>', {
        message: 'El ID de usuario no puede contener caracteres HTML'
    })
    @Matches(/^[a-zA-Z0-9-_]+$/, {
        message: 'El ID de usuario contiene caracteres no permitidos'
    })
    userId?: string;


}
