import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const kafkaBrokerUrl = configService.get<string>('KAFKA_BROKER_URL');

  const groupId = configService.get<string>(
    'KAFKA_CONSUMER_GROUP_ID',
    'dispatch-consumer',
  );

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [kafkaBrokerUrl],
        ssl: false,
      },
      consumer: {
        groupId: groupId,
      },
      producer: {
        allowAutoTopicCreation: true,
      },
    },
  });

  await app.listen(configService.get<string>('PORT'));
}
bootstrap();
