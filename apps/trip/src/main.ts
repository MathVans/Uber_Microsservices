import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { grpcClientOptions } from './infrastructure/config/grpc-options.config';
import { useCustomProtobufTimestampHandler } from '@app/common/protobuf/protobufjs-wrapper';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>(grpcClientOptions, {
    inheritAppConfig: true,
  });

  useCustomProtobufTimestampHandler();

  app.init();
  app.startAllMicroservices();
}
bootstrap();
