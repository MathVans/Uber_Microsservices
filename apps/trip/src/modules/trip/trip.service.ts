import { HttpStatus, Injectable } from "@nestjs/common";
import { CreateTripDto } from "./dto/create-trip.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Trip, TripDocument } from "./entities/trip.entity";
import { Model } from "mongoose";
import { RpcException } from "@nestjs/microservices";
import { EstimateTripDto } from "@app/common/modules/trip/dto/estimate-trip.dto";
import { EstimateTripResponse } from "@app/common/modules/trip/dto/estimate-trip.reponse";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { firstValueFrom } from "rxjs";
import { TripStatus } from "@app/common/shared/enum/trip-status.enum";

@Injectable()
export class TripService {
  private readonly googleMapsApiKey: string;
  private readonly googleMapsApiUrl: string;

  constructor(
    @InjectModel(Trip.name) private tripModel: Model<TripDocument>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.googleMapsApiKey = this.configService.get<string>(
      "GOOGLE_MAPS_API_KEY",
    ) || "your-api-key";

    this.googleMapsApiUrl = this.configService.get<string>(
      "GOOGLE_MAPS_API_URL",
    ) || "your-api-key";
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
      travelMode: "DRIVE",
      routingPreference: "TRAFFIC_AWARE",
    };

    const headers = {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": this.googleMapsApiKey,
      "X-Goog-FieldMask":
        "originIndex,destinationIndex,status,condition,distanceMeters,duration",
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post(this.googleMapsApiUrl, requestBody, { headers }),
      );

      if (
        response.statusText != "OK" ||
        response.data[0].condition != "ROUTE_EXISTS"
      ) {
        throw new RpcException({
          statusCode: HttpStatus.NOT_FOUND,
          message: "Não foi possivel encontrar a rota da Google Api.",
        });
      }

      const route = response.data[0];

      const distanceInMeters: number = route.distanceMeters;
      const durationInSeconds: number = parseFloat(
        route.duration.replace("s", ""),
      );
      const price = this.calculatePrice(distanceInMeters, durationInSeconds);
      console.log("🚀 ~ TripService ~ estimate ~ price:", price);

      return {
        estimatedPrice: price,
        currency: "BRL",
        distance: route.distance,
        duration: route.duration,
      };
    } catch (error) {
      console.error(
        "Erro ao chamar Google Routes API:",
        error,
      );

      throw new RpcException({
        statusCode: HttpStatus.BAD_GATEWAY,
        message: "Não foi possível calcular a estimativa da rota.",
      });
    }
  }

  async create(createTripDto: CreateTripDto): Promise<Trip> {
    try {
      return await this.tripModel.create({
        ...createTripDto,
        status: "requested",
      });
    } catch (error) {
      throw new RpcException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: "Erro ao criar corrida.",
      });
    }
  }

  async cancel(tripId: string): Promise<boolean> {
    try {
      const updateData = {
        $set: {
          status: TripStatus.CANCELED,
        },
      };

      const trip = await this.tripModel.findByIdAndUpdate(tripId, updateData)
        .exec();

      if (!trip) {
        throw new RpcException({
          statusCode: HttpStatus.NOT_FOUND,
          message: "Viagem não encontrada.",
        });
      }
      return !!trip;
    } catch (error) {
      throw new RpcException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      });
    }
  }

  async accept(tripId: string): Promise<boolean> {
    try {
      const updateData = {
        $set: {
          status: TripStatus.ACCEPTED,
        },
      };

      const trip = await this.tripModel.findByIdAndUpdate(tripId, updateData)
        .exec();

      if (!trip) {
        throw new RpcException({
          statusCode: HttpStatus.NOT_FOUND,
          message: "Viagem não encontrada.",
        });
      }
      return !!trip;
    } catch (error) {
      throw new RpcException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      });
    }
  }

  async start(tripId: string): Promise<boolean> {
    try {
      const updateData = {
        $set: {
          status: TripStatus.IN_PROGRESS,
        },
      };

      const trip = await this.tripModel.findByIdAndUpdate(tripId, updateData)
        .exec();

      if (!trip) {
        throw new RpcException({
          statusCode: HttpStatus.NOT_FOUND,
          message: "Viagem não encontrada.",
        });
      }
      return !!trip;
    } catch (error) {
      throw new RpcException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      });
    }
  }
  async finish(tripId: string): Promise<boolean> {
    try {
      const updateData = {
        $set: {
          status: TripStatus.COMPLETED,
        },
      };

      const trip = await this.tripModel.findByIdAndUpdate(tripId, updateData)
        .exec();

      if (!trip) {
        throw new RpcException({
          statusCode: HttpStatus.NOT_FOUND,
          message: "Viagem não encontrada.",
        });
      }
      return !!trip;
    } catch (error) {
      throw new RpcException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      });
    }
  }

  async findAll(): Promise<Trip[]> {
    try {
      return await this.tripModel.find();
    } catch (error) {
      throw new RpcException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error,
      });
    }
  }

  async findOne(tripId: string): Promise<Trip> {
    try {
      const trip = await this.tripModel.findById(tripId).exec();
      if (!trip) {
        throw new RpcException({
          statusCode: HttpStatus.NOT_FOUND,
          message: "Viagem não encontrada.",
        });
      }
      return trip;
    } catch (error) {
      console.error(
        "Erro ao chamar Google Routes API:",
        error,
      );

      throw new RpcException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: "Não foi possivel encontrar corrida.",
      });
    }
  }

  async findUserId(id: string): Promise<Trip[]> {
    try {
      const trips = await this.tripModel.find({
        passengerId: id,
        driverId: id,
      }).exec();

      return trips;
    } catch (error) {
      console.error(
        "Erro ao chamar Google Routes API:",
        error,
      );

      throw new RpcException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: "Não foi possivel encontrar corrida.",
      });
    }
  }

  private calculatePrice(
    distanceInMeters: number,
    durationInSeconds: number,
  ): number {
    const BASE_FEE = 5.00;
    const PER_KM_RATE = 1.40;
    const PER_MINUTE_RATE = 0.26;

    const distanceInKm = distanceInMeters / 1000;
    const durationInMinutes = durationInSeconds / 60;

    const price = BASE_FEE + (distanceInKm * PER_KM_RATE) +
      (durationInMinutes * PER_MINUTE_RATE);

    return parseFloat(price.toFixed(2));
  }
}
