import { Module } from '@nestjs/common';
import { MatchingController } from './modules/matching/matching.controller';
import { MatchingService } from './modules/matching/matching.service';
import { MatchingModule } from './modules/matching/matching.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath:"apps/dispatch/.env"
  }),
  MatchingModule
],
  controllers: [MatchingController],
  providers: [MatchingService],
})
export class AppModule {}
