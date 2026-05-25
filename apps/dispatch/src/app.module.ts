import { Module } from '@nestjs/common';
import { MatchingModule } from './modules/matching/matching.module';
import { ConfigModule } from '@nestjs/config';
import { RedisInfraModule } from './infrastructure/redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/dispatch/.env',
    }),
    RedisInfraModule,
    MatchingModule,
  ],
})
export class AppModule {}
