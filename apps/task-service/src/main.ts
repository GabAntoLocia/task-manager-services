import { NestFactory } from '@nestjs/core';
import { TaskServiceModule } from './task-service.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';
import path from 'path';
import { TcpExceptionFilter } from 'common/filters/tcp-exception.filter';

dotenv.config({ path: path?.resolve(__dirname, '../../../.env') });

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    TaskServiceModule,
    {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: 3002, // Puerto para el servicio de usuarios
      },
    },
  );

  // Registrar filtro global
  app.useGlobalFilters(new TcpExceptionFilter());
  await app.listen();
  console.log('User Microservice is listening on port 3002');
}
bootstrap();
