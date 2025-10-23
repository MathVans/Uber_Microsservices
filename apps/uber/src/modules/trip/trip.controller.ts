import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { TripService } from "./trip.service";
import { CreateTripDto } from "@app/common/modules/trip/dto/create-trip.dto";
import { EstimateTripDto } from "@app/common/modules/trip/dto/estimate-trip.dto";

@Controller("trip")
export class TripController {
  constructor(private readonly tripService: TripService) {}

  @Post("/estimate")
  estimate(@Body() estimateTripDto: EstimateTripDto) {
    return this.tripService.estimate(estimateTripDto);
  }

  @Post()
  create(@Body() createTripDto: CreateTripDto) {
    return this.tripService.create(createTripDto);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.tripService.findOne(id);
  }
}
