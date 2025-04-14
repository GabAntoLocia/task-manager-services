import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Task } from '../src/domain/entities/task.entity';
import { ITaskRepository } from '../src/domain/interfaces/task-repository.interface';
import { UpdateTaskDto } from '../src/aplication/dto/update-task.dto';
import { PaginationOptions } from 'libs/interfaces/prisma-repository.interface';
import {
    NotFoundException,
    ConflictException,
    InternalServerErrorException
} from '@nestjs/common';

@Injectable()
export class TaskPrismaRepository implements ITaskRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(task: Task): Promise<Task> {
        try {
            const createdTask = await this.prisma.task.create({
                data: {
                    id: task.id,
                    title: task.title,
                    description: task.description,
                    priority: task.priority,
                    status: task.status,
                    userId: task.userId,
                    createdAt: task.createdAt,
                },
            });
            return this.toDomainEntity(createdTask);
        } catch (error) {
            if (error.code === 'P2002') { // Violación de constraint único
                throw new ConflictException('Task title already exists');
            }
            throw new InternalServerErrorException('Failed to create task');
        }
    }

    async findAll(options?: PaginationOptions): Promise<Task[]> {
        try {
            const safePage = Math.max(1, options?.page || 1);
            const safeLimit = Math.min(Math.max(1, options?.limit || 10), 100);
            const skip = (safePage - 1) * safeLimit;

            const tasks = await this.prisma.task.findMany({
                skip,
                take: safeLimit,
                where: options?.where,
            });
            console.log(tasks);
            return tasks.map(this.toDomainEntity);
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch tasks');
        }
    }

    async findById(id: string): Promise<Task | null> {
        try {
            const task = await this.prisma.task.findUnique({
                where: { id }
            });
            return task ? this.toDomainEntity(task) : null;
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch task');
        }
    }

    async update(taskId: string, updateData: UpdateTaskDto): Promise<Task> {
        try {
            console.log("updateData ", updateData);
            console.log("taskId ", taskId);
            const updatedTask = await this.prisma.task.update({
                where: { id: taskId },
                data: {
                    ...updateData,
                    updatedAt: new Date()
                }
            });
            console.log("updatedTask ", updatedTask);
            return this.toDomainEntity(updatedTask);
        } catch (error) {
            if (error.code === 'P2025') {
                throw new NotFoundException('Task not found');
            }
            if (error.code === 'P2002') {
                throw new ConflictException('Task title already exists');
            }
            
            throw new InternalServerErrorException('Failed to update task');
        }
    }

    async delete(id: string): Promise<void> {
        try {
            // Intenta eliminar la tarea
            const result = await this.prisma.task.delete({
                where: { id }
            });

            // Si no lanza error, la eliminación fue exitosa
            return;

        } catch (error) {
            // Manejo específico de errores de Prisma
            if (error.code === 'P2025') {
                // Record not found
                throw new NotFoundException(`Task with ID ${id} not found`);
            }

            // Otros errores de base de datos
            throw new InternalServerErrorException('Failed to delete task', {
                cause: error,
            });
        }
    }

    private toDomainEntity(prismaTask: any): Task {
        console.log("prismaTask ", prismaTask);
        return {
            id: prismaTask.id,
            title: prismaTask.title,
            description: prismaTask.description || '',
            priority: prismaTask.priority,
            status: prismaTask.status,
            userId: prismaTask.userId,
            createdAt: prismaTask.createdAt,
            updatedAt: prismaTask.updatedAt
        };
    }
}