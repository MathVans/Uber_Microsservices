import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Trip } from './entities/trip.entity';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { HttpService } from '@nestjs/axios';
import { isAxiosError } from 'axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { TripStatus } from '@app/common/shared/enum/trip-status.enum';
import { TripStatusResponse } from '@app/common/modules/trip/dto/trip-status.response';
import { randomUUID } from 'crypto';
import { Any } from 'google/protobuf/any';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  type CreateTripRequest,
  type TripResponse,
  type EstimateRequest,
  type EstimateResponse,
  TripListResponse,
} from '@app/common/proto/trip';
import { toProtoTimestamp } from '@app/common/shared/helpers/proto.helpers';
import { Code } from 'typeorm/browser';

@Injectable()
export class TripService {
  private readonly googleMapsApiKey: string;
  private readonly googleMapsApiUrl: string;

  constructor(
    @InjectRepository(Trip) private tripRepository: Repository<Trip>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,

    @Inject('DISPATCH_SERVICE') private readonly dispatchClient: ClientProxy,
  ) {
    this.googleMapsApiKey =
      this.configService.get<string>('GOOGLE_MAPS_API_KEY') || 'your-api-key';

    this.googleMapsApiUrl =
      this.configService.get<string>('GOOGLE_MAPS_API_URL') || 'your-api-url';
  }

  private emitEvent(eventName: string, data: object): void {
    const payload = {
      eventId: randomUUID(),
      eventName,
      occurredAt: new Date().toISOString(),
      data,
    };

    this.dispatchClient.emit(eventName, payload).subscribe({
      next: () =>
        console.log(
          `[TripService] Evento '${eventName}-${payload.eventId}' emitido com sucesso`,
        ),
      error: (err) =>
        console.error(`[TripService] Erro ao emitir '${eventName}'`, err),
    });
  }

  async checkhealth(): Promise<Any> {
    this.dispatchClient.emit('check.health', 'Is this healthy?').subscribe();

    return {
      typeUrl: 'health',
      value: new Uint8Array(),
    };
  }

  async estimate(estimateTripDto: EstimateRequest): Promise<EstimateResponse> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.googleMapsApiUrl}?origin=${estimateTripDto.origin}&destination=${estimateTripDto.destination}&key=${this.googleMapsApiKey}`,
        ),
      );

      const route = response.data.routes[0];

      if (!response.data?.routes?.length) {
        throw new RpcException({
          code: HttpStatus.NOT_FOUND,
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
        startAddress: startAddress,
        endAddress: endAddress,
      };
    } catch (error) {
      if (error instanceof RpcException) throw error;

      if (isAxiosError(error)) {
        throw new RpcException({
          code: HttpStatus.BAD_GATEWAY,
          message: 'Falha ao consultar Google Maps.',
          details: error.response?.data ?? error.message,
        });
      }

      throw new RpcException({
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Erro interno ao estimar corrida.',
      });
    }
  }

  async create(createTripDto: CreateTripRequest): Promise<TripResponse> {
    const estimatedPrice = this.calculatePrice(
      createTripDto.distanceInMeters,
      createTripDto.durationInSeconds,
    );

    const trip = this.tripRepository.create({
      ...createTripDto,
      status: TripStatus.REQUESTED,
      estimatedPrice,
    });

    const savedTrip = await this.tripRepository.save(trip);

    this.emitEvent('trip.requested', savedTrip);

    return savedTrip;
  }

  async findOne(tripId: string): Promise<TripResponse> {
    return this.findTripOrThrow(tripId);
  }

  async findTripsByUserId(id: string): Promise<TripListResponse> {
    try {
      const trips = await this.tripRepository.find({
        where: [{ passengerId: id }, { driverId: id }],
      });

      return { trips };
    } catch (error) {
      throw new RpcException({
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Não foi possivel encontrar corrida.',
      });
    }
  }

  private async findTripOrThrow(tripId: string): Promise<Trip> {
    const trip = await this.tripRepository.findOneBy({ id: tripId });

    if (!trip) {
      throw new RpcException({
        code: HttpStatus.NOT_FOUND,
        message: 'Viagem não encontrada.',
      });
    }

    return trip;
  }

  async cancel(tripId: string): Promise<TripStatusResponse> {
    const trip = await this.findTripOrThrow(tripId);

    trip.status = TripStatus.CANCELED;
    await this.tripRepository.save(trip);

    const date = new Date();

    this.emitEvent('trip.canceled', {
      tripId: trip.id,
      passengerId: trip.passengerId,
      driverId: trip.driverId,
      status: TripStatus.CANCELED,
      canceledAt: date.toISOString(),
    });

    return {
      code: HttpStatus.OK,
      message: 'Corrida cancelada com sucesso.',
      date: date.toISOString(),
    };
  }

  async accept(tripId: string): Promise<TripStatusResponse> {
    const trip = await this.findTripOrThrow(tripId);

    trip.status = TripStatus.ACCEPTED;
    await this.tripRepository.save(trip);

    const date = new Date();

    // Emite evento para o DispatchService notificar o passageiro
    // que um motorista aceitou a corrida
    this.emitEvent('trip.accepted', {
      tripId: trip.id,
      passengerId: trip.passengerId,
      driverId: trip.driverId,
      status: TripStatus.ACCEPTED,
      acceptedAt: date.toISOString(),
    });

    return {
      code: HttpStatus.OK,
      message: 'Corrida aceita com sucesso.',
      date: date.toISOString(),
    };
  }

  async start(tripId: string): Promise<TripStatusResponse> {
    const trip = await this.findTripOrThrow(tripId);

    trip.status = TripStatus.IN_PROGRESS;
    await this.tripRepository.save(trip);

    const date = new Date();

    this.emitEvent('trip.started', {
      tripId: trip.id,
      passengerId: trip.passengerId,
      driverId: trip.driverId,
      status: TripStatus.IN_PROGRESS,
      startedAt: date.toISOString(),
    });

    return {
      code: HttpStatus.OK,
      message: 'Corrida iniciada.',
      date: date.toISOString(),
    };
  }

  async finish(tripId: string): Promise<TripStatusResponse> {
    const trip = await this.findTripOrThrow(tripId);

    trip.status = TripStatus.COMPLETED;
    await this.tripRepository.save(trip);

    const date = new Date();

    // Emite evento para o DispatchService:
    // - Notificar passageiro com resumo da corrida
    // - Iniciar cobrança
    // - Liberar motorista para novas corridas
    this.emitEvent('trip.finished', {
      tripId: trip.id,
      passengerId: trip.passengerId,
      driverId: trip.driverId,
      estimatedPrice: trip.estimatedPrice,
      status: TripStatus.COMPLETED,
      finishedAt: date.toISOString(),
    });

    return {
      code: HttpStatus.OK,
      message: 'Corrida finalizada com sucesso.',
      date: date.toISOString(),
    };
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
}
