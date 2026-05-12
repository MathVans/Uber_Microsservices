import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { join } from 'path';
import { AUTHENTICATION_PACKAGE_NAME } from '@app/common/proto/auth';
import { IDENTITY_PACKAGE_NAME } from '@app/common/proto/users';

@Module({
  imports: [
    ClientsModule.register({
      isGlobal: true,
      clients: [
        {
          name: AUTHENTICATION_PACKAGE_NAME,
          transport: Transport.GRPC,
          options: {
            url: 'localhost:5001',
            package: AUTHENTICATION_PACKAGE_NAME,
            IDENTITY_PACKAGE_NAME,
            protoPath: [
              join(process.cwd(), 'libs/common/src/proto/auth.proto'),
            ],
          },
        },
      ],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
