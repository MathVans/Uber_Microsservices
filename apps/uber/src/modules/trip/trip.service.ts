import { Inject, Injectable } from "@nestjs/common";
import { CreateTripDto } from "@app/common/modules/trip/dto/create-trip.dto";
import { EstimateTripDto } from "@app/common/modules/trip/dto/estimate-trip.dto";
import { ClientProxy } from "@nestjs/microservices";
import { TRIP_PATTERNS } from "@app/common/modules/trip/trip.patterns";

@Injectable()
export class TripService {
  constructor(@Inject("TRIP_CLIENT") private tripClient: ClientProxy) {}
  create(createTripDto: CreateTripDto) {
    return "This action adds a new trip";
  }

  findAll() {
    return `This action returns all trip`;
  }

  findOne(id: number) {
    return `This action returns a #${id} trip`;
  }

  async estimate(estimateTripDto: EstimateTripDto) {
    return await this.tripClient.send(TRIP_PATTERNS.ESTIMATE, estimateTripDto);
  }
}
