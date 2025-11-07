import { Module } from '@nestjs/common';
import { TripModule } from './modules/trip/trip.module';
import { MongooseModule } from '@nestjs/mongoose';
import { mongoConfig } from './shared/infra/database/database';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: 'apps/trip/.env' }),
    MongooseModule.forRootAsync(mongoConfig),
    TripModule,
  ],
})
export class AppModule {}
