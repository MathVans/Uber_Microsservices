import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { CreateTripDto } from '@app/common/modules/trip/dto/create-trip.dto';
import { EstimateTripDto } from '@app/common/modules/trip/dto/estimate-trip.dto';
import * as microservices from '@nestjs/microservices';
import { TRIP_PATTERNS } from '@app/common/modules/trip/trip.patterns';
import { lastValueFrom } from 'rxjs';
import { TripResponse } from '@app/common/modules/trip/dto/trip.response';
import {
  TRIPS_PACKAGE_NAME,
  TRIPS_SERVICE_NAME,
  TripsClient,
} from '@app/common/proto/trip';

@Injectable()
export class TripService implements OnModuleInit {
  private grpcTripService: TripsClient;

  constructor(
    @Inject(TRIPS_PACKAGE_NAME) private tripClient: microservices.ClientGrpc,
  ) {}
  onModuleInit(): void {
    this.grpcTripService =
      this.tripClient.getService<TripsClient>(TRIPS_SERVICE_NAME);
  }

  async checkHealth() {
    return this.grpcTripService.health({});
  }

  async estimate(estimateTripDto: EstimateTripDto): Promise<any> {
    const result = this.grpcTripService.estimate(estimateTripDto);

    return await lastValueFrom(result);
  }

  async create(createTripDto: CreateTripDto): Promise<TripResponse> {
    const result = this.grpcTripService.create(createTripDto);

    return await lastValueFrom(result);
  }

  async findOne(id: string): Promise<TripResponse> {
    const result = this.grpcTripService.findOne({ id });
    return await lastValueFrom(result);
  }

  // async findByUser(id: string): Promise<TripResponse[]> {
  //   const result = this.tripClient.send(TRIP_PATTERNS.FIND_BY_USER, id);
  //   return await lastValueFrom(result);
  // }

  // async cancel(tripId: string): Promise<TripStatusResponse> {
  //   const result = this.tripClient.send(TRIP_PATTERNS.CANCEL, tripId);
  //   return await lastValueFrom(result);
  // }

  // async accept(tripId: string): Promise<boolean> {
  //   const result = this.tripClient.send(TRIP_PATTERNS.ACCEPT, tripId);
  //   return await lastValueFrom(result);
  // }

  // async start(tripId: string): Promise<boolean> {
  //   const result = this.tripClient.send(TRIP_PATTERNS.START, tripId);
  //   return await lastValueFrom(result);
  // }

  // async finish(tripId: string): Promise<boolean> {
  //   const result = this.tripClient.send(TRIP_PATTERNS.FINISH, tripId);
  //   return await lastValueFrom(result);
  // }
}
