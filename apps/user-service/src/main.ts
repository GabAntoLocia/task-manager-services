import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import path from 'path';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { UserServiceModule } from './user-service.module';
import { ConfigService } from '@nestjs/config';
import { TcpExceptionFilter } from 'common/filters/tcp-exception.filter';
import { ValidationPipe } from '@nestjs/common';

dotenv.config({ path: path?.resolve(__dirname, '../../../.env') });

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UserServiceModule,
    {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: 3001, // Puerto para el servicio de usuarios
      },
    },
  );


  // Registrar filtro global
  app.useGlobalFilters(new TcpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());
  await app.listen();
  console.log('User Microservice is listening on port 3001');
}
bootstrap();