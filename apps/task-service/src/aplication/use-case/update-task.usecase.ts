import { Injectable, NotFoundException, ConflictException, Inject, BadRequestException } from '@nestjs/common';
import { ITaskRepository } from '../../domain/interfaces/task-repository.interface';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class UpdateTaskUseCase {
  constructor(
    @Inject('ITaskRepository')
    private readonly taskRepository: ITaskRepository
) {}

  async execute(taskId: string, updateData: UpdateTaskDto) {
    //  Verificar existencia
    const existingTask = await this.taskRepository.findById(taskId);

        // Validar el DTO
        const updateTaskInstance = plainToInstance(UpdateTaskDto, updateData);
        const errors = await validate(updateTaskInstance);
    
        if (errors.length > 0) {
          console.error('Validation errors:', errors);
          const errorMessages = errors.map(err => Object.values(err.constraints || {}).join(', ')).join('; ');
          throw new BadRequestException(`Validation failed: ${errorMessages}`);
        }
    

    if (!existingTask) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    //Actualizar
    try {
      const updatedTask = await this.taskRepository.update(taskId, updateData);
      return updatedTask;
    } catch (error) {
      console.error('Error updating task:', error);
      throw new ConflictException(`Failed to update task: ${error.message}`);
    }
  }
}