import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './infrastructure/configs/swagger.config';
import { GrpcExceptionFilter } from './shared/filters/grpc-exception.filter';

async function bootstrap() {
  const port = Number(process.env.PORT) || 3000;
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new GrpcExceptionFilter());
  setupSwagger(app, 'api/docs');

  app.setGlobalPrefix('api/v1');
  await app.listen(port);
}

bootstrap();
