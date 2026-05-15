import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  namespace: '/drivers',
  cors: {
    origin: '*',
  },
})
export class DriverLocationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  @SubscribeMessage('update_driver_location')
  handleDriverLocationUpdate(
    @MessageBody() data: { driverId: string; lat: number; lng: number },
  ) {
    console.log(
      '🚀 ~ DriverLocationGateway ~ handleDriverLocationUpdate ~ data:',
      data,
    );
    this.server.emit('reply', data);
  }

  @SubscribeMessage('update_passenger_location')
  handlePassengerLocationUpdate(
    @MessageBody() data: { passenger: string; lat: number; lng: number },
  ) {
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
