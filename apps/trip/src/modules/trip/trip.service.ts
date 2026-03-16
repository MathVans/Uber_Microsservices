import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateTripDto } from '@app/common/modules/trip/dto/create-trip.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Trip, TripDocument } from './entities/trip.entity';
import { Model } from 'mongoose';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { EstimateTripDto } from '@app/common/modules/trip/dto/estimate-trip.dto';
import { EstimateTripResponse } from '@app/common/modules/trip/dto/estimate-trip.reponse';
import { HttpService } from '@nestjs/axios';
import { AxiosError, isAxiosError } from 'axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { TripStatus } from '@app/common/shared/enum/trip-status.enum';
import { TripResponse } from '@app/common/modules/trip/dto/trip.response';
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
      this.configService.get<string>('GOOGLE_MAPS_API_URL') || 'your-api-url';
  }

  async checkhealth() {
    const result = this.dispatchClient.emit('check.health', 'Is this healthy?');
    return result;
  }

  async estimate(
    estimateTripDto: EstimateTripDto,
  ): Promise<EstimateTripResponse> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.googleMapsApiUrl}?origin=${estimateTripDto.origin}&destination=${estimateTripDto.destination}&key=${this.googleMapsApiKey}`,
        ),
      );

      const route = response.data.routes[0];

      if (!response.data?.routes?.length) {
        throw new RpcException({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Nao foi possivel encontrar rota.',
        });
      }

      const distanceInMeters: number = route.legs[0].distance.value;

      const durationInSeconds: number = parseFloat(
        route.legs[0].duration.value,
      );

      const startAddress = route.legs[0].start_address;
      const endAddress = route.legs[0].end_address;

      const price = this.calculatePrice(distanceInMeters, durationInSeconds);

      return {
        estimatedPrice: price,
        currency: 'BRL',
        distance: route.legs[0].distance.text,
        duration: route.legs[0].duration.text,
        start_address: startAddress,
        end_address: endAddress,
      };
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }

      if (isAxiosError(error)) {
        throw new RpcException({
          statusCode: HttpStatus.BAD_GATEWAY,
          message: 'Falha ao consultar Google Maps.',
          details: error.response?.data ?? error.message,
        });
      }

      throw new RpcException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Erro interno ao estimar corrida.',
      });
    }
  }

  async create(createTripDto: CreateTripDto): Promise<TripResponse> {
    const estimatedPrice = this.calculatePrice(
      createTripDto.distanceInMeters,
      createTripDto.durationInSeconds,
    );

    const trip = await this.tripModel.create({
      ...createTripDto,
      status: 'requested',
      estimatedPrice: estimatedPrice,
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

  async findOne(tripId: string): Promise<TripResponse> {
    const trip = await this.tripModel.findById(tripId).exec();
    if (!trip) {
      throw new RpcException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Viagem não encontrada.',
      });
    }
    return this.mapToResponseDto(trip);
  }

  async findUserId(id: string): Promise<TripResponse[]> {
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

  private mapToResponseDto(trip: TripDocument): TripResponse {
    return {
      id: trip._id.toString(),
      passengerId: trip.passengerId,
      driverId: trip.driverId,
      status: trip.status,
      estimatedPrice: trip.estimatedPrice,
      finalPrice: trip.finalPrice,
      createdAt: trip.createdAt.toISOString(),
    };
  }
}
