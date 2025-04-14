import { Inject, Injectable } from '@nestjs/common';
import { ITaskRepository } from '../../domain/interfaces/task-repository.interface';
import { TaskResponseDto } from '../dto/task-response.dto';
import { PaginationOptions } from 'libs/interfaces/prisma-repository.interface';
import {
    NotFoundException,
    BadRequestException
} from '@nestjs/common';

@Injectable()
export class GetTasksUseCase {
    constructor(
        @Inject('ITaskRepository')
        private readonly taskRepository: ITaskRepository
    ) { }

    async execute(options: PaginationOptions): Promise<TaskResponseDto[]> {

        //Validar dto
        

        if (options?.limit && options?.limit > 100) {
            throw new BadRequestException('Maximum limit is 100');
        }

        if (options?.page && options?.page < 1) {
            throw new BadRequestException('Page must be greater than 0');
        }

        const tasks = await this.taskRepository.findAll({
            ...options,
            page: options?.page || 1,
            limit: Math.min(options?.limit || 10, 100),

        });

        // Validar resultados
        if (!tasks || tasks.length === 0) {
            throw new NotFoundException('No tasks found with the given filters');
        }


        return tasks.map(task => new TaskResponseDto({
            id: task.id,
            title: task.title,
            description: task.description || '', // Valor por defecto
            priority: task.priority,
            status: task.status,
            userId: task.userId,
            createdAt: task.createdAt,
            updatedAt: task.updatedAt
        }));
    }
}