import { Module } from '@nestjs/common';
import { TripService } from './trip.service';
import { TripController } from './trip.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TRIPS_PACKAGE_NAME } from '@app/common/proto/trip';
import { join } from 'path';

@Module({
  imports: [
    ClientsModule.register({
      isGlobal: true,
      clients: [
        {
          name: TRIPS_PACKAGE_NAME,
          transport: Transport.GRPC,
          options: {
            url: 'localhost:5002',
            package: TRIPS_PACKAGE_NAME,
            protoPath: [
              join(process.cwd(), 'libs/common/src/proto/trip.proto'),
            ],
          },
        },
      ],
    }),
  ],
  controllers: [TripController],
  providers: [TripService],
})
export class TripModule {}
