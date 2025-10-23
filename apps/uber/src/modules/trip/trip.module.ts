import { Module } from "@nestjs/common";
import { TripService } from "./trip.service";
import { TripController } from "./trip.controller";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({
  imports: [ClientsModule.register([{
    name: "TRIP_CLIENT",
    transport: Transport.TCP,
    options: { port: 3002 },
  }])],
  controllers: [TripController],
  providers: [TripService],
})
export class TripModule {}
