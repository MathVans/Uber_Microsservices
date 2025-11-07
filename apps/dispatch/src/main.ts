import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const kafkaBrokerUrl = configService.get<string>('KAFKA_BROKER_URL');

  await app.listen();
  console.log('✅ Dispatch Service está escutando eventos Kafka...');
}
bootstrap();
