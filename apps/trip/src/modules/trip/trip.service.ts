import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateTripDto } from '@app/common/modules/trip/dto/create-trip.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Trip, TripDocument } from './entities/trip.entity';
import { Model } from 'mongoose';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { EstimateTripDto } from '@app/common/modules/trip/dto/estimate-trip.dto';
import { EstimateTripResponse } from '@app/common/modules/trip/dto/estimate-trip.reponse';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { TripStatus } from '@app/common/shared/enum/trip-status.enum';
import { TripResponseDto } from '@app/common/modules/trip/dto/tripResponse.dto';
import { TripStatusResponse } from '@app/common/modules/trip/dto/trip-status.response';

@Injectable()
export class TripService {
  private readonly googleMapsApiKey: string;
  private readonly googleMapsApiUrl: string;

  constructor(
    @InjectModel(Trip.name) private tripModel: Model<TripDocument>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,

    @Inject('DISPATCH_SERVICE') private readonly dispatchClient: ClientProxy,
  ) {
    this.googleMapsApiKey =
      this.configService.get<string>('GOOGLE_MAPS_API_KEY') || 'your-api-key';

    this.googleMapsApiUrl =
      this.configService.get<string>('GOOGLE_MAPS_API_URL') || 'your-api-key';
  }

  async estimate(
    estimateTripDto: EstimateTripDto,
  ): Promise<EstimateTripResponse> {
    const requestBody = {
      origins: [
        {
          waypoint: {
            location: {
              latLng: {
                latitude: estimateTripDto.startLocation.coordinates[1],
                longitude: estimateTripDto.startLocation.coordinates[0],
              },
            },
          },
        },
      ],
      destinations: [
        {
          waypoint: {
            location: {
              latLng: {
                latitude: estimateTripDto.endLocation.coordinates[1],
                longitude: estimateTripDto.endLocation.coordinates[0],
              },
            },
          },
        },
      ],
      travelMode: 'DRIVE',
      routingPreference: 'TRAFFIC_AWARE',
    };

    const headers = {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': this.googleMapsApiKey,
      'X-Goog-FieldMask':
        'originIndex,destinationIndex,status,condition,distanceMeters,duration',
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post(this.googleMapsApiUrl, requestBody, { headers }),
      );

      if (
        response.statusText != 'OK' ||
        response.data[0].condition != 'ROUTE_EXISTS'
      ) {
        throw new RpcException({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Não foi possivel encontrar a rota da Google Api.',
        });
      }

      const route = response.data[0];

      const distanceInMeters: number = route.distanceMeters;
      const durationInSeconds: number = parseFloat(
        route.duration.replace('s', ''),
      );
      const price = this.calculatePrice(distanceInMeters, durationInSeconds);

      return {
        estimatedPrice: price,
        currency: 'BRL',
        distance: route.distance,
        duration: route.duration,
      };
    } catch (error) {
      throw new RpcException({
        statusCode: HttpStatus.BAD_GATEWAY,
        message: 'Não foi possível calcular a estimativa da rota.',
      });
    }
  }

  async checkhealth(){
    const result = this.dispatchClient.emit("check.health", "Is this healthy?")
    console.log("🚀 ~ TripService ~ health ~ result:", result)

    return result;
  }

  async create(createTripDto: CreateTripDto): Promise<TripResponseDto> {
      const { startLocation, endLocation } = createTripDto;
      const estimate = await this.estimate({ startLocation, endLocation });
      const trip = await this.tripModel.create({
        ...createTripDto,
        status: 'requested',
        estimatedPrice: estimate.estimatedPrice,
      });

      const result = this.mapToResponseDto(trip);

      this.dispatchClient.emit('trip.requested', result);
      console.log(
        `[TripService] Evento 'trip.requested' emitido para a corrida ${result.id}`,
      );
      return result;
  }

  async cancel(tripId: string): Promise<TripStatusResponse> {
      const updateData = {
        $set: {
          status: TripStatus.CANCELED,
        },
      };

      const trip = await this.tripModel
        .findByIdAndUpdate(tripId, updateData)
        .exec();

      if (!trip) {
        throw new RpcException({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Viagem não encontrada.',
        });
      }

      const date = new Date(Date.now());

      return {
        statusCode: HttpStatus.OK,
        message: 'Corrida cancelada com sucesso.',
        date: date.toISOString(),
      };
  }


  async accept(tripId: string): Promise<TripStatusResponse> {
      const updateData = {
        $set: {
          status: TripStatus.ACCEPTED,
        },
      };

      const trip = await this.tripModel
        .findByIdAndUpdate(tripId, updateData)
        .exec();

      if (!trip) {
        throw new RpcException({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Viagem não encontrada.',
        });
      }

      const date = new Date(Date.now());

      return {
        statusCode: HttpStatus.OK,
        message: 'Corrida aceita com sucesso.',
        date: date.toISOString(),
      };
  }

  async start(tripId: string): Promise<TripStatusResponse> {
      const updateData = {
        $set: {
          status: TripStatus.IN_PROGRESS,
        },
      };

      const trip = await this.tripModel
        .findByIdAndUpdate(tripId, updateData)
        .exec();

      if (!trip) {
        throw new RpcException({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Viagem não encontrada.',
        });
      }

      const date = new Date(Date.now());
      return {
        statusCode: HttpStatus.OK,
        message: 'Corrida iniciada.',
        date: date.toISOString(),
      };
  }

  async finish(tripId: string): Promise<TripStatusResponse> {
      const updateData = {
        $set: {
          status: TripStatus.COMPLETED,
        },
      };

      const trip = await this.tripModel
        .findByIdAndUpdate(tripId, updateData)
        .exec();

      if (!trip) {
        throw new RpcException({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Viagem não encontrada.',
        });
      }

      const date = new Date(Date.now());
      return {
        statusCode: HttpStatus.OK,
        message: 'Corrida finalizada com sucesso.',
        date: date.toISOString(),
      };
  }

  async findOne(tripId: string): Promise<TripResponseDto> {
      const trip = await this.tripModel.findById(tripId).exec();
      if (!trip) {
        throw new RpcException({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Viagem não encontrada.',
        });
      }
      return this.mapToResponseDto(trip);
  }

  async findUserId(id: string): Promise<TripResponseDto[]> {
    try {
      const trips = await this.tripModel
        .find({
          $or: [{ passengerId: id }, { driverId: id }],
        })
        .exec();

      return trips.map((trip) => this.mapToResponseDto(trip));
    } catch (error) {

      throw new RpcException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Não foi possivel encontrar corrida.',
      });
    }
  }

  private calculatePrice(
    distanceInMeters: number,
    durationInSeconds: number,
  ): number {
    const BASE_FEE = 5.0;
    const PER_KM_RATE = 1.4;
    const PER_MINUTE_RATE = 0.26;

    const distanceInKm = distanceInMeters / 1000;
    const durationInMinutes = durationInSeconds / 60;

    const price =
      BASE_FEE +
      distanceInKm * PER_KM_RATE +
      durationInMinutes * PER_MINUTE_RATE;

    return parseFloat(price.toFixed(2));
  }

  private mapToResponseDto(trip: TripDocument): TripResponseDto {
    return {
      id: trip._id.toString(),
      passengerId: trip.passengerId,
      driverId: trip.driverId,
      status: trip.status,
      startLocation: {
        type: 'Point',
        coordinates: trip.startLocation.coordinates as [number, number],
      },
      endLocation: {
        type: 'Point',
        coordinates: trip.endLocation.coordinates as [number, number],
      },
      estimatedPrice: trip.estimatedPrice,
      finalPrice: trip.finalPrice,
      createdAt: trip.createdAt.toISOString(),
    };
  }
}
