import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsDateString,
  IsUUID,
  IsOptional,
  Matches,
  NotContains,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Task, TaskPriority, TaskStatus } from '../../domain/entities/task.entity';
import { sanitizeHtml } from 'common/utils/sanitize-html';


export class TaskResponseDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID único de la tarea',
    required: true
  })
  @IsUUID(4)
  id: string;

  @ApiProperty({
    example: 'Implementar validaciones OWASP',
    description: 'Título de la tarea',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  @NotContains('<', { message: 'No se permiten etiquetas HTML' })
  @NotContains('>', { message: 'No se permiten etiquetas HTML' })
  @Matches(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ\s.,;:()¿?¡!-]+$/, {
    message: 'Caracteres no permitidos en el título'
  })
  @Transform(({ value }) => value?.trim())

  title: string;

  @ApiProperty({
    example: 'Implementar validaciones según OWASP Top 10',
    description: 'Descripción detallada de la tarea',
    required: false
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => sanitizeHtml(value))
  @Transform(({ value }) => value?.trim())

  description?: string;

  @ApiProperty({
    enum: ['LOW', 'MEDIUM', 'HIGH'],
    example: 'PENDING',
    description: 'Estado actual de la tarea',
    required: true
  })
  @IsEnum(['PENDING', 'COMPLETED'])

  status: TaskStatus;

  @ApiProperty({
    enum: ['LOW', 'MEDIUM', 'HIGH'],
    example: 'MEDIUM',
    description: 'Prioridad de la tarea',
    required: true
  })
  @IsEnum(['LOW', 'MEDIUM', 'HIGH'])

  priority: TaskPriority;

  @ApiProperty({
    example: '2023-12-31T23:59:59.999Z',
    description: 'Fecha de creación en ISO8601',
    required: true
  })
  @IsDateString()

  createdAt: Date;

  @ApiProperty({
    example: '2023-12-31T23:59:59.999Z',
    description: 'Fecha de última actualización en ISO8601',
    required: false
  })
  @IsOptional()
  @IsDateString()

  updatedAt?: Date;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID del usuario propietario',
    required: false
  })
  @IsOptional()
  @IsUUID(4)

  userId?: string;

  constructor(task: Task) {
    this.id = task.id;
    this.title = task.title;
    this.description = task.description;
    this.priority = task.priority;
    this.status = task.status;
    this.createdAt = task.createdAt;
    this.updatedAt = task.updatedAt;
    this.userId = task.userId;
  }
}