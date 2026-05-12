import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  MicroserviceOptions,
  RpcException,
  Transport,
} from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { AUTHENTICATION_PACKAGE_NAME } from '@app/common/proto/auth';
import { IDENTITY_PACKAGE_NAME } from '@app/common/proto/users';

async function bootstrap() {
  const port = Number(process.env.PORT) || 5001;
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: [IDENTITY_PACKAGE_NAME, AUTHENTICATION_PACKAGE_NAME],
        protoPath: [
          join(process.cwd(), 'libs/common/src/proto/users.proto'),
          join(process.cwd(), 'libs/common/src/proto/auth.proto'),
        ],
        url: `localhost:${port}`,
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
