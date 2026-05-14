import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { TripService } from './trip.service';
import {
  type CreateTripRequest,
  type EstimateRequest,
  type EstimateResponse,
  IdRequest,
  TripListResponse,
  type TripResponse,
  TripsController,
  TripsControllerMethods,
} from '@app/common/proto/trip';
import { Metadata } from '@grpc/grpc-js';
import { Any } from 'google/protobuf/any';
import type { Empty } from 'google/protobuf/empty';
import { Observable } from 'rxjs';

@Controller()
@TripsControllerMethods()
export class TripController implements TripsController {
  constructor(private readonly tripService: TripService) {}

  @GrpcMethod('Trips', 'health')
  health(
    request: Empty,
    metadata?: Metadata,
  ): Promise<Any> | Observable<Any> | Any {
    return this.tripService.checkhealth();
  }

  @GrpcMethod('Trips', 'estimate')
  estimate(
    request: EstimateRequest,
    metadata?: Metadata,
  ):
    | Promise<EstimateResponse>
    | Observable<EstimateResponse>
    | EstimateResponse {
    return this.tripService.estimate(request);
  }

  @GrpcMethod('Trips', 'create')
  create(
    request: CreateTripRequest,
    metadata?: Metadata,
  ): Promise<TripResponse> | Observable<TripResponse> | TripResponse {
    return this.tripService.create(request);
  }

  findOne(
    request: IdRequest,
    metadata?: Metadata,
  ): Promise<TripResponse> | Observable<TripResponse> | TripResponse {
    return this.tripService.findOne(request.id);
  }
  findByUser(
    request: IdRequest,
    metadata?: Metadata,
  ):
    | Promise<TripListResponse>
    | Observable<TripListResponse>
    | TripListResponse {
    throw new Error('Method not implemented.');
  }
  // @MessagePattern(TRIP_PATTERNS.FIND_BY_USER)
  // findByUser(@Payload() id: string) {
  //   return this.tripService.findUserId(id);
  // }

  // @MessagePattern(TRIP_PATTERNS.CANCEL)
  // cancel(@Payload() id: string) {
  //   return this.tripService.cancel(id);
  // }

  // @MessagePattern(TRIP_PATTERNS.ACCEPT)
  // accept(@Payload() id: string) {
  //   return this.tripService.accept(id);
  // }

  // @MessagePattern(TRIP_PATTERNS.START)
  // start(@Payload() id: string) {
  //   return this.tripService.start(id);
  // }

  // @MessagePattern(TRIP_PATTERNS.FINISH)
  // finish(@Payload() id: string) {
  //   return this.tripService.finish(id);
  // }
}
