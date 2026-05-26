import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { randomUUID } from 'crypto';

@Injectable()
export class RedisGeoRepository {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async upsertDriverLocation(driverId: string, lat: number, lng: number) {
    await this.redis.geoadd('drivers:geo', lng, lat, driverId);
  }

  async findNearbyDrivers(lat: number, lng: number, radiusKm: number) {
    return this.redis.georadius('drivers:geo', lng, lat, radiusKm, 'km');
  }
}
