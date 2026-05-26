import { randomUUID } from 'crypto';
import { ClientProxy } from '@nestjs/microservices';

export const EmitEvent = (
  client: ClientProxy,
  eventName: string,
  data: object,
): void => {
  const payload = {
    eventId: randomUUID(),
    eventName,
    occurredAt: new Date().toISOString(),
    data,
  };

  client.emit(eventName, payload).subscribe({
    next: () =>
      console.log(
        `Evento '${eventName}-${payload.eventId}' emitido com sucesso`,
      ),
    error: (err) => console.error(`Erro ao emitir '${eventName}'`, err),
  });
};
