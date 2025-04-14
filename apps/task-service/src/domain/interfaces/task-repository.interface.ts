import { PaginationOptions } from 'libs/interfaces/prisma-repository.interface';
import { Task } from '../entities/task.entity';
import { UpdateTaskDto } from '../../aplication/dto/update-task.dto';

export interface ITaskRepository {
    create(task: Task): Promise<Task>;
    findById(id: string): Promise<Task | null>;
    findAll(options: PaginationOptions): Promise<Task[]>;
    update(taskId: string, updateData: UpdateTaskDto): Promise<Task>;
    delete(id: string): Promise<void>;
}


export interface GetTasksPayload extends PaginationOptions {
    page: number;
    limit: number;
    where?: {
        status?: 'PENDING' | 'COMPLETED';
        priority?: 'LOW' | 'MEDIUM' | 'HIGH';
        userId?: string;
    };
    sorting?: {
        field?: 'createdAt' | 'updatedAt' | 'priority' | 'title';
        order?: 'asc' | 'desc';
    };

}