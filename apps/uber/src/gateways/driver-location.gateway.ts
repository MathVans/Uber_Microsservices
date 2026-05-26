import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { randomUUID } from 'crypto';
import { Server, Socket } from 'socket.io';
import { EmitEvent } from '../modules/dispatch/helpers/event-emitter';

@WebSocketGateway({
  namespace: '/drivers',
  cors: {
    origin: '*',
  },
})
export class DriverLocationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    @Inject('DISPATCH_SERVICE') private readonly dispatchClient: ClientProxy,
  ) {}
  @WebSocketServer() server: Server;

  @SubscribeMessage('update_driver_location')
  handleDriverLocationUpdate(
    @MessageBody() data: { driverId: string; lat: number; lng: number },
  ) {
    EmitEvent(this.dispatchClient, 'driver.location', data);
    this.server.emit('reply', data);
  }

  @SubscribeMessage('update_passenger_location')
  handlePassengerLocationUpdate(
    @MessageBody() data: { passenger: string; lat: number; lng: number },
  ) {
    EmitEvent(this.dispatchClient, 'passenger.location', data);
    this.server.emit('reply', data);
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(
      '🚀 ~ DriverLocationGateway ~ handleConnection ~ client:',
      client.id,
    );
  }
  handleDisconnect(client: Socket) {
    console.log(
      '🚀 ~ DriverLocationGateway ~ handleDisconnect ~ client:',
      client.id,
    );
  }
}
