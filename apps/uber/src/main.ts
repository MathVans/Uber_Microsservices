import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './shared/configs/swagger.config';

async function bootstrap() {
  const port = Number(process.env.PORT) || 3000;
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  setupSwagger(app, 'api/docs');

  app.setGlobalPrefix('api/v1');
  await app.listen(port);
}

bootstrap();
