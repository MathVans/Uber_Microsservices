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
import { IdDto } from "../../shared/common/dto/Id-dto";

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

  @Get()
  findByUser(@Body() idDto: IdDto) {
    return this.tripService.findByUser(idDto.id);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.tripService.findOne(id);
  }

  @Post("/:id/cancel")
  cancel(@Param("id") id: string) {
    return this.tripService.cancel(id);
  }

  @Post("/:id/accept")
  accept(@Param("id") id: string) {
    return this.tripService.accept(id);
  }

  @Post("/:id/start")
  start(@Param("id") id: string) {
    return this.tripService.start(id);
  }

  @Post("/:id/finish")
  finish(@Param("id") id: string) {
    return this.tripService.finish(id);
  }
}
