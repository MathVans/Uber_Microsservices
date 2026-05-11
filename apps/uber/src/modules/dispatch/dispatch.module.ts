import { Module } from '@nestjs/common';
import { DispatchService } from './dispatch.service';
import { DispatchController } from './dispatch.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'DISPATCH_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => {
          const brokersStr =
            config.get<string>('KAFKA_BROKERS') ??
            config.get<string>('KAFKA_BROKER_URL') ??
            'localhost:9092';

          const brokers = brokersStr.split(',').map((b) => b.trim());

          return {
            transport: Transport.KAFKA,
            options: {
              client: {
                clientId: 'uber-gateway',
                brokers,
              },
              consumer: {
                groupId: 'uber-gateway-consumer',
              },
              producer: {
                allowAutoTopicCreation: true,
              },
            },
          };
        },
      },
    ]),
  ],
  controllers: [DispatchController],
  providers: [DispatchService],
})
export class DispatchModule {}
