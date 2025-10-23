import { Inject, Injectable } from "@nestjs/common";
import { CreateTripDto } from "@app/common/modules/trip/dto/create-trip.dto";
import { EstimateTripDto } from "@app/common/modules/trip/dto/estimate-trip.dto";
import { ClientProxy } from "@nestjs/microservices";
import { TRIP_PATTERNS } from "@app/common/modules/trip/trip.patterns";
import { lastValueFrom } from "rxjs";
import { EstimateTripResponse } from "@app/common/modules/trip/dto/estimate-trip.reponse";
import { TripResponseDto } from "@app/common/modules/trip/dto/tripResponse.dto";

@Injectable()
export class TripService {
  constructor(@Inject("TRIP_CLIENT") private tripClient: ClientProxy) {}

  async estimate(
    estimateTripDto: EstimateTripDto,
  ): Promise<EstimateTripResponse> {
    const result = this.tripClient.send(
      TRIP_PATTERNS.ESTIMATE,
      estimateTripDto,
    );

    return await lastValueFrom(result);
  }

  async create(createTripDto: CreateTripDto): Promise<TripResponseDto> {
    const result = this.tripClient.send(
      TRIP_PATTERNS.CREATE,
      createTripDto,
    );

    return await lastValueFrom(result);
  }

  async findOne(id: string) {
    const result = this.tripClient.send(
      TRIP_PATTERNS.FIND_ONE,
      id,
    );

    return await lastValueFrom(result);
  }

  async findByUser(id: string) {
    const result = this.tripClient.send(
      TRIP_PATTERNS.FIND_BY_USER,
      id,
    );

    return await lastValueFrom(result);
  }

  
}
