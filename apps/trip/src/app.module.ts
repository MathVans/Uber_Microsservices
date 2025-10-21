import { Module } from "@nestjs/common";
import { TripModule } from "./modules/trip/trip.module";

@Module({
  imports: [TripModule],
})
export class AppModule {}
