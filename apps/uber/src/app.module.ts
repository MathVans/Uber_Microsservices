import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { TripModule } from './modules/trip/trip.module';
import { DispatchModule } from './modules/dispatch/dispatch.module';

@Module({
  imports: [UsersModule, AuthModule, TripModule, DispatchModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
