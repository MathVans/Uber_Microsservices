import { Module } from "@nestjs/common";
import { TripModule } from "./modules/trip/trip.module";
import { MongooseModule } from "@nestjs/mongoose";
import { mongoConfig } from "./shared/infra/database/database";

@Module({
  imports: [MongooseModule.forRootAsync(mongoConfig), TripModule],
})
export class AppModule {}
