import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ITaskRepository } from '../../domain/interfaces/task-repository.interface';
import { CreateTaskDto } from '../dto/create-task.dto';
import { TaskResponseDto } from '../dto/task-response.dto';
import { Task } from '../../domain/entities/task.entity';
import {
  NotFoundException,
  BadRequestException
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class CreateTaskUseCase {
  constructor(
    @Inject('ITaskRepository') private readonly taskRepository: ITaskRepository,
    @Inject('USER_SERVICE') private readonly userClient: ClientProxy,
  ) { }

  async execute(createTaskDto: CreateTaskDto): Promise<TaskResponseDto> {
    const { userId, authorization, ...taskData } = createTaskDto;

    //Validar dto
    const createTaskInstance = plainToInstance(CreateTaskDto, createTaskDto);
    const errors = await validate(createTaskInstance);

    if (errors.length > 0) {
      console.error('Validation errors:', errors);
      const errorMessages = errors.map(err => Object.values(err.constraints || {}).join(', ')).join('; ');
      throw new BadRequestException(`Validation failed: ${errorMessages}`);
    }

    if (!authorization) {
      throw new BadRequestException('Authorization token is required');
    }

    const token = authorization.startsWith('Bearer ') ? authorization.split(' ')[1] : authorization;
    console.log('Token:', token);
    // Verificar usuario
    const user = await firstValueFrom(
      this.userClient.send(
        { cmd: 'v1.api.users.profile' },
        { token }
      )
    ).catch(() => {
      throw new NotFoundException('User not found or service unavailable');
    });

    //  Crear entidad de dominio
    const task = new Task(
      crypto.randomUUID(),
      taskData.title,
      taskData.description || '',
      taskData.priority,
      taskData.status,
      user.id,
      new Date(),
      taskData.updatedAt || new Date(),
    );

    const createdTask = await this.taskRepository.create(task);
    return new TaskResponseDto(createdTask);
  }
}