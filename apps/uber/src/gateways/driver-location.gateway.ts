import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { ClientGrpc, ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';

@WebSocketGateway({ namespace: '/drivers' })
export class DriverLocationGateway {
  constructor(
    @Inject('DISPATCH_API_SERVICE') private dispatchApiClient: ClientProxy,
  ) {}
  @SubscribeMessage('update_location')
  handleLocationUpdate(
    @MessageBody() data: { driverId: string; lat: number; lng: number },
  ) {}
}
