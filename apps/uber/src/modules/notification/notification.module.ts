import { Module } from '@nestjs/common';
import { DriverLocationGateway } from '../../gateways/driver-location.gateway';

@Module({ providers: [DriverLocationGateway] })
export class NotificationModule {}
