import { Module } from "@nestjs/common";
import { TripService } from "./trip.service";
import { TripController } from "./trip.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { Trip, TripSchema } from "./entities/trip.entity";
import { HttpModule } from "@nestjs/axios";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule,
    HttpModule,
    MongooseModule.forFeature([{ name: Trip.name, schema: TripSchema }]),
  ],
  controllers: [TripController],
  providers: [TripService],
})
export class TripModule {}
