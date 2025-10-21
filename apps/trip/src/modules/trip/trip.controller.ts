import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TripService } from './trip.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';

@Controller()
export class TripController {
  constructor(private readonly tripService: TripService) {}

  @MessagePattern('createTrip')
  create(@Payload() createTripDto: CreateTripDto) {
    return this.tripService.create(createTripDto);
  }

  @MessagePattern('findAllTrip')
  findAll() {
    return this.tripService.findAll();
  }

  @MessagePattern('findOneTrip')
  findOne(@Payload() id: number) {
    return this.tripService.findOne(id);
  }

  @MessagePattern('updateTrip')
  update(@Payload() updateTripDto: UpdateTripDto) {
    return this.tripService.update(updateTripDto.id, updateTripDto);
  }

  @MessagePattern('removeTrip')
  remove(@Payload() id: number) {
    return this.tripService.remove(id);
  }
}
