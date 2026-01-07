import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { TripModule } from './modules/trip/trip.module';
import { DispatchModule } from './modules/dispatch/dispatch.module';
import { ConfigModule } from '@nestjs/config';
import { GlobalJwtModule } from '@app/common/modules/auth/jwt.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: './apps/uber/.env' }),
    GlobalJwtModule,
    UsersModule,
    TripModule,
    DispatchModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
