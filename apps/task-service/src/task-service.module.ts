import { Module } from '@nestjs/common';
import { TaskServiceControllerV1 } from './infrastructure/controllers/v1/task-service.controller';
import { TaskServiceService } from './task-service.service';
import { CreateTaskUseCase } from './aplication/use-case/create-task.usecase';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TaskPrismaRepository } from '../prisma/task-repository';
import { GetTasksUseCase } from './aplication/use-case/get-tasks.usecase';
import { AuthModule } from '@app/libs/auth';
import { ITaskRepository } from './domain/interfaces/task-repository.interface';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateTaskUseCase } from './aplication/use-case/update-task.usecase';
import { DeleteTaskUseCase } from './aplication/use-case/delete-task.usecase';

@Module({
  imports: [
    AuthModule,
    ClientsModule.register([
      {
        name: 'USER_SERVICE', // Nombre del cliente para inyección
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3001,
          
        },
      },
    ]),
  ],
  controllers: [TaskServiceControllerV1],
  providers: [
    PrismaService,
    TaskPrismaRepository,
    {
      provide: 'ITaskRepository',
      useFactory: (prismaService: PrismaService) => new TaskPrismaRepository(prismaService),
      inject: [PrismaService],
    },
    UpdateTaskUseCase,
    GetTasksUseCase,
    CreateTaskUseCase,
    DeleteTaskUseCase,
  ],
})
export class TaskServiceModule {}