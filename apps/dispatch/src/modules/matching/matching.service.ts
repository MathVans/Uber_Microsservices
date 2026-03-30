import { Injectable } from '@nestjs/common';
import { CreateMatchingDto } from './dto/create-matching.dto';
import { UpdateMatchingDto } from './dto/update-matching.dto';

@Injectable()
export class MatchingService {
  async storeDriverLocation(driverId, coords) {}
  async findNearbyDrivers(origin, radius, filters) {}
  async attemptMatch(trip, driver) {}
  async confirmDriver(tripId, driverId) {}
}
