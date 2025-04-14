import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import { TcpExceptionFilter } from 'common/filters/tcp-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';



async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v',
    defaultVersion: '1'
  });
  const config = new DocumentBuilder()
    .setTitle('API Gateway')
    .setDescription('Documentación de la API Gateway para los microservicios')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  
  app.useGlobalFilters(new TcpExceptionFilter());
  await app.listen(process.env.PORT ?? 3000);

}
bootstrap();
