import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const kafkaBrokerUrl = configService.get<string>('KAFKA_BROKER_URL');
  const port = configService.get<string>('PORT');

  const groupId = configService.get<string>(
    'KAFKA_CONSUMER_GROUP_ID',
    'dispatch-consumer',
  );
  console.log('🚀 ~ bootstrap ~ groupId:', groupId);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: { brokers: [kafkaBrokerUrl] },
      consumer: { groupId },
      producer: { allowAutoTopicCreation: true },
    },
  });
  await app.startAllMicroservices();
  await app.listen(port);
}
bootstrap();
