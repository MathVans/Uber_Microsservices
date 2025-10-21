import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { TripService } from "./trip.service";
import { CreateTripDto } from "./dto/create-trip.dto";
import { UpdateTripDto } from "./dto/update-trip.dto";
import { TRIP_PATTERNS } from "@app/common/modules/trip/trip.patterns";

@Controller()
export class TripController {
  constructor(private readonly tripService: TripService) {}

  @MessagePattern(TRIP_PATTERNS.CREATE)
  create(@Payload() createTripDto: CreateTripDto) {
    return this.tripService.create(createTripDto);
  }

  @MessagePattern(TRIP_PATTERNS.LIST)
  list() {
    return this.tripService.findAll();
  }

  @MessagePattern(TRIP_PATTERNS.FIND_ONE)
  findOne(@Payload() id: string) {
    return this.tripService.findOne(id);
  }

  @MessagePattern(TRIP_PATTERNS.START)
  start(@Payload() id: number) {
    // return this.tripService.findOne(id);
  }

  @MessagePattern(TRIP_PATTERNS.CANCEL)
  cancel(@Payload() id: number) {
    // return this.tripService.findOne(id);
  }

  @MessagePattern(TRIP_PATTERNS.FINISH)
  finish(@Payload() id: number) {
    // return this.tripService.findOne(id);
  }

  @MessagePattern(TRIP_PATTERNS.ACCEPT)
  accept(@Payload() id: number) {
    // return this.tripService.findOne(id);
  }
}
