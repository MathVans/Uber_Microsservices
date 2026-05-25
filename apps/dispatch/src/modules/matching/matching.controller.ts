import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { MatchingService } from './matching.service';

@Controller()
export class MatchingController {
  constructor(private readonly matchingService: MatchingService) {}

  @EventPattern('trip.requested')
  async handleTripRequested(@Payload() tripData: any) {
    console.log(
      '[DispatchController] Evento trip.requested recebido:',
      tripData,
    );

    // Aqui você implementa a lógica de matching:
    // // 1. Buscar motoristas próximos
    // // 2. Enviar notificação aos motoristas
    // // 3. Aguardar aceitação
    // // 4. Confirma corrida
  }
}
