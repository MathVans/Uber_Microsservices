import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TripService } from './trip.service';

import { TRIP_PATTERNS } from '@app/common/modules/trip/trip.patterns';
import { EstimateTripDto } from '@app/common/modules/trip/dto/estimate-trip.dto';
import { CreateTripDto } from '@app/common/modules/trip/dto/create-trip.dto';

@Controller()
export class TripController {
  constructor(private readonly tripService: TripService) {}

  @MessagePattern(TRIP_PATTERNS.ESTIMATE)
  estimate(@Payload() estimateTripDto: EstimateTripDto) {
    return this.tripService.estimate(estimateTripDto);
  }

  @MessagePattern(TRIP_PATTERNS.CREATE)
  create(@Payload() createTripDto: CreateTripDto) {
    return this.tripService.create(createTripDto);
  }

  @MessagePattern(TRIP_PATTERNS.FIND_ONE)
  findOne(@Payload() id: string) {
    return this.tripService.findOne(id);
  }

  @MessagePattern(TRIP_PATTERNS.FIND_BY_USER)
  findByUser(@Payload() id: string) {
    return this.tripService.findUserId(id);
  }

  @MessagePattern(TRIP_PATTERNS.CANCEL)
  cancel(@Payload() id: string) {
    return this.tripService.cancel(id);
  }

  @MessagePattern(TRIP_PATTERNS.ACCEPT)
  accept(@Payload() id: string) {
    return this.tripService.accept(id);
  }

  @MessagePattern(TRIP_PATTERNS.START)
  start(@Payload() id: string) {
    return this.tripService.start(id);
  }

  @MessagePattern(TRIP_PATTERNS.FINISH)
  finish(@Payload() id: string) {
    return this.tripService.finish(id);
  }

  @MessagePattern(TRIP_PATTERNS.HEALTH)
  health() {
    return this.tripService.checkhealth();
  }
}
