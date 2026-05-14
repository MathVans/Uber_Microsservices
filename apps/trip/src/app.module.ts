import { Module } from '@nestjs/common';
import { TripModule } from './modules/trip/trip.module';
import { DatabaseModule } from './shared/infra/database/database';
import { ConfigModule } from '@nestjs/config';
import { GrpcReflectionModule } from 'nestjs-grpc-reflection';
import { grpcClientOptions } from './infrastructure/config/grpc-options.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: 'apps/trip/.env' }),
    GrpcReflectionModule.register(grpcClientOptions),
    DatabaseModule,
    TripModule,
  ],
})
export class AppModule {}
