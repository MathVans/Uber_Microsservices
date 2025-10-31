import { NestFactory } from '@nestjs/core';
import { MatchingModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(MatchingModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
