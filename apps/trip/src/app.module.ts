import { Module } from '@nestjs/common';
import { TripModule } from './modules/trip/trip.module';
import { DatabaseModule } from './shared/infra/database/database';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: 'apps/trip/.env' }),
    DatabaseModule,
    TripModule,
  ],
})
export class AppModule {}
