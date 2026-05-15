import { Module } from '@nestjs/common';

import { UsersModule } from './modules/users/users.module';
import { TripModule } from './modules/trip/trip.module';
import { DispatchModule } from './modules/dispatch/dispatch.module';
import { ConfigModule } from '@nestjs/config';
import { GlobalJwtModule } from '@app/common/modules/auth/jwt.module';
import { AuthModule } from './modules/auth/auth.module';
import { NotificationModule } from './modules/notification/notification.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: './apps/uber/.env' }),
    GlobalJwtModule,
    AuthModule,
    UsersModule,
    TripModule,
    DispatchModule,
    NotificationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
