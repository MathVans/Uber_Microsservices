import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { Partitioners } from 'kafkajs';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'DISPATCH_SERVICE',
          brokers: ['localhost:9092'],
          retry: {
            initialRetryTime: 300,
            retries: 10,
          },
        },
        consumer: {
          groupId: 'dispatch-consumer',
          allowAutoTopicCreation: true, 
        },
      },
    },
  );

  await app.listen();
  console.log('✅ Dispatch Service está escutando eventos Kafka...');
}
bootstrap();
