import { Injectable, NotFoundException, ForbiddenException, Inject, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ITaskRepository } from '../../domain/interfaces/task-repository.interface';

@Injectable()
export class DeleteTaskUseCase {
  constructor(
    @Inject('ITaskRepository')
    private readonly taskRepository: ITaskRepository
  ) {}

  async execute(taskId: string, userId: string): Promise<{ success: boolean }> {
    // 1. Validar que el taskId exista
    if (!taskId) {
      throw new BadRequestException('Task ID is required');
    }

    // 2. Buscar la tarea
    const task = await this.taskRepository.findById(taskId);
    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }

    // 3. Verificar ownership (que el usuario sea el dueño)
    if (task.userId !== userId) {
      throw new ForbiddenException('You can only delete your own tasks');
    }

    // 4. Eliminar la tarea
    try {
      await this.taskRepository.delete(taskId);
      return { success: true };
    } catch (error) {
      // Manejo específico de errores de base de datos
      if (error.code === 'P2025') { // Código de Prisma para "Record not found"
        throw new NotFoundException('Task was already deleted');
      }
      throw new InternalServerErrorException('Failed to delete task');
    }
  }
}