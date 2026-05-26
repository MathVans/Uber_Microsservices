import { Injectable } from '@nestjs/common';
import { RedisGeoRepository } from './repository/RedisGeo.repository';
import { LocalizationRequest } from '@app/common/proto/dispatch';

@Injectable()
export class MatchingService {
  constructor(private readonly repo: RedisGeoRepository) {}

  async storeDriverLocation(data: any) {
    const { driverId, lat, lng } = data;
    this.repo.upsertDriverLocation(driverId, lat, lng);
  }

  async findNearbyDrivers(origin, radius, filters) {}

  async attemptMatch(trip, driver) {}
  async confirmDriver(tripId, driverId) {}
}
