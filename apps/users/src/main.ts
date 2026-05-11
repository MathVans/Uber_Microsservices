import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  MicroserviceOptions,
  RpcException,
  Transport,
} from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';

async function bootstrap() {
  const port = Number(process.env.PORT) || 3050;
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'users',
        protoPath: join(__dirname, './infrastructure/proto/users.proto'),
        url: 'localhost:50051',
      },
    },
  );

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        return new RpcException(errors);
      },
    }),
  );

  await app.listen();
}
bootstrap();
