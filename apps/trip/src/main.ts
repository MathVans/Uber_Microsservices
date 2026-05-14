import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, RpcException } from '@nestjs/microservices';
import { grpcClientOptions } from './infrastructure/config/grpc-options.config';
import { useCustomProtobufTimestampHandler } from '@app/common/protobuf/protobufjs-wrapper';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>(grpcClientOptions, {
    inheritAppConfig: true,
  });

  useCustomProtobufTimestampHandler();
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        console.log('🚀 ~ bootstrap ~ errors:', errors);
        return new RpcException(errors);
      },
    }),
  );

  app.init();
  app.startAllMicroservices();
}
bootstrap();
