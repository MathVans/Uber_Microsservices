import { Module } from '@nestjs/common';
import { TripService } from './trip.service';
import { TripController } from './trip.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trip } from './entities/trip.entity';
import { HttpModule } from '@nestjs/axios';
import { KafkaModule } from '../../shared/clients/clients.module';

@Module({
  imports: [KafkaModule, HttpModule, TypeOrmModule.forFeature([Trip])],
  controllers: [TripController],
  providers: [TripService],
})
export class TripModule {}
