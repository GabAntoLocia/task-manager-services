import {
  BadRequestException,
  Controller,
  NotFoundException,
  UseGuards
} from '@nestjs/common';
import {
  MessagePattern,
  Payload,
} from '@nestjs/microservices';
import { GetTasksUseCase } from 'apps/task-service/src/aplication/use-case/get-tasks.usecase';
import { CreateTaskDto } from 'apps/task-service/src/aplication/dto/create-task.dto';
import { CreateTaskUseCase } from 'apps/task-service/src/aplication/use-case/create-task.usecase';
import { JwtAuthGuard } from 'libs/auth/src/guards/jwt-auth.guard';
import { CurrentUser } from 'libs/auth/src/decorators/current-user.decorator';
import { GetTasksPayload } from 'apps/task-service/src/domain/interfaces/task-repository.interface';
import { UpdateTaskUseCase } from 'apps/task-service/src/aplication/use-case/update-task.usecase';
import { DeleteTaskUseCase } from 'apps/task-service/src/aplication/use-case/delete-task.usecase';
import { TaskPriority } from 'apps/task-service/src/domain/entities/task.entity';
import { TaskStatus } from 'apps/task-service/src/aplication/dto/update-task.dto';

@Controller()
export class TaskServiceControllerV1 {
  constructor(
    private readonly getTaskUseCase: GetTasksUseCase,
    private readonly createTaskUseCase: CreateTaskUseCase,
    private readonly updateTaskUseCase: UpdateTaskUseCase,
    private readonly deleteTaskUseCase: DeleteTaskUseCase,
  ) { }

  @MessagePattern({ cmd: 'v1.api.task.create' })
  @UseGuards(JwtAuthGuard)
  async createTask(
    @Payload() body: CreateTaskDto,
    @CurrentUser('sub') userId: string
  ) {
    return this.createTaskUseCase.execute({ ...body, userId });
  }

  @MessagePattern({ cmd: 'v1.api.task.getAll' })
  @UseGuards(JwtAuthGuard)
  async getTasks(
    @Payload() payload: GetTasksPayload & { authorization: string },
    @CurrentUser('sub') userId: string
  ) {
    const options: GetTasksPayload = {
      where: {
        ...payload?.where,
        userId // Filtro de seguridad automático
      },

      page: payload?.page || 1,
      limit: Math.min(payload?.limit || 10, 100),
      sorting: payload.sorting || { field: 'createdAt', order: 'desc' }
    };

    const tasks = await this.getTaskUseCase.execute(options);

    if (tasks.length === 0) {
      throw new NotFoundException('No tasks found with these filters');
    }

    return tasks;
  }
  @MessagePattern({ cmd: 'v1.api.task.update' })
  @UseGuards(JwtAuthGuard)
  async updateTask(
    @Payload() message: { 
      taskId: string; 
      title?: string; 
      status?: TaskStatus; 
      description?: TaskPriority;
      [key: string]: any 
    },
  ) {
    // Extrae taskId y el resto de los campos por separado
    const { taskId, ...updateData } = message;
  
    if (!taskId) {
      throw new BadRequestException('Task ID is required');
    }
  
    return this.updateTaskUseCase.execute(
      taskId,
      {
        title: updateData?.title,
        status: updateData?.status,
        description: updateData?.description,
        priority: updateData?.priority,

      } // Envía solo los campos a actualizar (sin el taskId)
    );
  }

  @MessagePattern({ cmd: 'v1.api.task.delete' })
  @UseGuards(JwtAuthGuard)
  async deleteTask(
    @Payload() payload: { taskId: string },
    @CurrentUser('sub') userId: string
  ) {
    return this.deleteTaskUseCase.execute(payload.taskId, userId);
  }
}