import { Inject, Injectable } from "@nestjs/common";
import { CreateTripDto } from "@app/common/modules/trip/dto/create-trip.dto";
import { EstimateTripDto } from "@app/common/modules/trip/dto/estimate-trip.dto";
import { ClientProxy } from "@nestjs/microservices";
import { TRIP_PATTERNS } from "@app/common/modules/trip/trip.patterns";
import { lastValueFrom } from "rxjs";
import { EstimateTripResponse } from "@app/common/modules/trip/dto/estimate-trip.reponse";
import { TripResponseDto } from "@app/common/modules/trip/dto/tripResponse.dto";
import { TripStatusResponse } from "@app/common/modules/trip/dto/trip-status.response";

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

  async findOne(id: string): Promise<TripResponseDto> {
    const result = this.tripClient.send(
      TRIP_PATTERNS.FIND_ONE,
      id,
    );

    return await lastValueFrom(result);
  }

  async findByUser(id: string): Promise<TripResponseDto[]> {
    const result = this.tripClient.send(
      TRIP_PATTERNS.FIND_BY_USER,
      id,
    );
    return await lastValueFrom(result);
  }

  async cancel(tripId: string): Promise<TripStatusResponse> {
    const result = this.tripClient.send(
      TRIP_PATTERNS.CANCEL,
      tripId,
    );
    return await lastValueFrom(result);
  }

  async accept(tripId: string): Promise<boolean> {
    const result = this.tripClient.send(
      TRIP_PATTERNS.ACCEPT,
      tripId,
    );
    return await lastValueFrom(result);
  }

  async start(tripId: string): Promise<boolean> {
    const result = this.tripClient.send(
      TRIP_PATTERNS.START,
      tripId,
    );
    return await lastValueFrom(result);
  }

  async finish(tripId: string): Promise<boolean> {
    const result = this.tripClient.send(
      TRIP_PATTERNS.FINISH,
      tripId,
    );
    return await lastValueFrom(result);
  }
}
