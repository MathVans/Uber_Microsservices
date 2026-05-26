import { Module } from '@nestjs/common';
import { MatchingService } from './matching.service';
import { MatchingController } from './matching.controller';
import { RedisGeoRepository } from './repository/RedisGeo.repository';

@Module({
  controllers: [MatchingController],
  providers: [MatchingService, RedisGeoRepository],
})
export class MatchingModule {}
