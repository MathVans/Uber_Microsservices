import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IDENTITY_PACKAGE_NAME } from '@app/common/proto/users';
import { join } from 'path';
import { AUTHENTICATION_PACKAGE_NAME } from '@app/common/proto/auth';

@Module({
  imports: [
    ClientsModule.register({
      isGlobal: true,
      clients: [
        {
          name: IDENTITY_PACKAGE_NAME,
          transport: Transport.GRPC,
          options: {
            url: 'localhost:5001',
            package: IDENTITY_PACKAGE_NAME,
            protoPath: [
              join(process.cwd(), 'libs/common/src/proto/users.proto'),
            ],
          },
        },
      ],
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
