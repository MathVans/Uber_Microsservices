import { TRIPS_PACKAGE_NAME } from '@app/common/proto/trip';
import { Transport } from '@nestjs/microservices';
import { addReflectionToGrpcConfig } from 'nestjs-grpc-reflection';
import { join } from 'path';

export const grpcClientOptions = addReflectionToGrpcConfig({
  transport: Transport.GRPC,
  options: {
    url: process.env.TRIP_GRPC_URL ?? '0.0.0.0:5002',
    package: TRIPS_PACKAGE_NAME,
    protoPath: join(process.cwd(), 'libs/common/src/proto/trip.proto'),
  },
});
