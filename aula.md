Vou dar uma "master class" prática de Kafka aplicada ao seu projeto: primeiro explico conceitos, depois mostro como isso se mapeia no código atual, corrijo/indico mudanças concretas e deixo exemplos de configuração e padrões a seguir. A seguir estão os passos que vou cobrir:

1. Conceitos essenciais do Kafka
2. Como mapear produtores/consumidores no NestJS (no seu projeto)
3. Problemas encontrados e correções concretas (arquivos e trechos)
4. Configurações recomendadas (env + NestJS)
5. Boas práticas operacionais (envelope, key, idempotência, DLQ, observabilidade)
6. Próximos passos sugeridos (o que implementar primeiro)

7. Conceitos essenciais (resumo rápido)

- Broker: nó do Kafka que armazena e replica mensagens. Conjunto de brokers = cluster.
- Topic: fluxo lógico de mensagens (ex.: trip.requested).
- Partition: cada topic é dividido em partições; mensagens em uma partição têm ordem.
- Producer: envia mensagens para um topic.
- Consumer: lê mensagens de um topic.
- Consumer Group: conjunto de consumidores que dividem as partições de um topic; cada mensagem é processada por apenas 1 instância do grupo.
- Offset: posição de leitura num partition.
- Key: chave opcional da mensagem; define partição (mesma key → mesma partição → ordem por key).
- Retention/DLQ: política de quanto tempo manter; DLQ = tratar mensagens que falham repetidamente.
- RPC vs Event: use RPC (request/response) para chamadas síncronas; use eventos (emit/fire-and-forget) para fatos de domínio assíncronos.

2. Como isso se encaixa no NestJS / no seu repo

- Producers no seu código:
  - `trip` produz evento `trip.requested` via Kafka: veja trip.service.ts (emit).
  - `uber` usa `ClientProxy.send` para operações RPC (TCP) com `trip`/`users`.
- Consumers no seu código:
  - `dispatch` consome `trip.requested` com `@EventPattern('trip.requested')`: veja matching.controller.ts.
- Transporte misto atual:
  - RPC via TCP (ex.: `users`, `trip` respondendo a `send`)
  - Eventos assíncronos via Kafka (ex.: `trip` emite `trip.requested`, `dispatch` consome)

3. Problemas encontrados e correções concretas

- Arquitetura híbrida está OK (RPC TCP + eventos Kafka), mas requer consistência e correções:
  - Correção: iniciar microservice Kafka no `dispatch` corretamente. Em main.ts você usa `app.connectMicroservice(...)` mas não chama `await app.startAllMicroservices()` — sem isso o consumer Kafka pode não iniciar. Adicionar:
    ```
    await app.startAllMicroservices();
    await app.listen(configService.get<string>('PORT'));
    ```
  - Problema de broker URL/ambiente: em `apps/trip/src/shared/clients/clients.module.ts` o broker está hardcoded `localhost:9092`, enquanto no `docker-compose` interno o broker interno é `broker:29092`.
    - Dentro de containers Docker use `broker:29092`.
    - Para execução local fora de container use `localhost:9092`.
    - Recomendo usar env var `KAFKA_BROKERS` e aponte para `broker:29092` em docker-compose (services) e `localhost:9092` em .env local.
  - Env inválido: `apps/trip/.env` tem `KAFKA_BROKER_URL=development` — isso não é um broker. Ajuste para `broker:29092` (em container) ou `localhost:9092` (local).
  - Padrões de mensagem incoerentes: ver [libs/common/src/modules/trip/trip.patterns.ts](libs/common/src/modules/trip/trip.patterns.ts) — `TRIP_PATTERNS.ESTIMATE` está mapeado para `'trip.findOne'` (parece errado). Verifique e renomeie para algo consistente, ex.:
    ```
    ESTIMATE: 'trip.estimate',
    CREATE: 'trip.create',
    FIND_ONE: 'trip.find',
    ...
    ```
  - Producer com key/partition: se precisar order garantida por `tripId`, produza com `key: tripId`. O `ClientProxy.emit` do Nest não expõe key diretamente; para controle fino você pode criar um produtor Kafka direto (kafkajs) ou custom serializer/strategy.
  - Falta envelope e metadata: padronize payloads (eventId, occurredAt, correlationId, version, data).

4. Exemplo de configuração recomendada (env + NestJS)

- .env (exemplo para execução dentro do Docker):
  - Em `apps/dispatch/.env` e `apps/trip/.env`:
    - KAFKA_BROKERS=broker:29092
    - KAFKA_CONSUMER_GROUP_ID=dispatch-consumer
    - PORT=3002 (dispatch) / 300? (trip TCP)
- ClientsModule padrão (exemplo para produtor no `trip`):
  - Em `apps/trip/src/shared/clients/clients.module.ts` use:
    ```ts
    ClientsModule.register([
      {
        name: 'DISPATCH_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: [process.env.KAFKA_BROKERS],
          },
          producer: {
            allowAutoTopicCreation: true,
          },
        },
      },
    ]),
    ```
- Iniciar consumers (correção em `apps/dispatch/src/main.ts`):
  ```ts
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: { brokers: [kafkaBrokerUrl] },
      consumer: { groupId },
      producer: { allowAutoTopicCreation: true },
    },
  });
  await app.startAllMicroservices();
  await app.listen(configService.get<string>('PORT'));
  ```
- Para enviar evento com `ClientProxy`:
  ```ts
  this.dispatchClient.emit('trip.requested', {
    eventId: uuid(),
    occurredAt: new Date().toISOString(),
    correlationId,
    data: {
      /* trip fields */
    },
  });
  ```

  - Se precisar `key` para particionamento, considere usar um produtor `kafkajs` direto para `producer.send({ topic, messages: [{ key: tripId, value: JSON.stringify(payload) }] })`.

5. Boas práticas operacionais e arquitetura de eventos

- Nome dos tópicos: use `dominio.acao` (ex.: `trip.requested`, `dispatch.matched`, `trip.finished`).
- Envelope de evento mínimo:
  - eventId, eventName, occurredAt, version, correlationId, data
- Particionamento: use `key = tripId` para garantir ordenação por corrida.
- Consumer groups: cada serviço que precisa processar todas as mensagens deve ter seu próprio consumer group. Se você quiser escalar o serviço, execute N instâncias do mesmo group.
- Idempotência: grave `eventId` em uma tabela de dedupe antes de aplicar efeitos (ou verifique estado atual).
- Retries e DLQ:
  - Implementar retry expondo lógica na aplicação (retries limitados) e, após falha, enviar evento para `topic.dlq` com metadata de erro.
- Observabilidade:
  - Log com `correlationId`, métricas (lag, throughput), e usar Kafka UI (já no docker-compose) para inspecionar tópicos.
- Segurança:
  - Remova variáveis sensíveis do repo (ex.: chave Google Maps em `apps/trip/.env`), use Vault/Secrets.

6. Fluxo de eventos sugerido para uma corrida (sequência)

- Command: `trip.create` (RPC from `uber` → `trip`)
- Event: `trip.requested` (producer `trip`)
- Event: `dispatch.matched` (producer `dispatch`)
- Event: `trip.accepted` (producer `trip` or `dispatch`)
- Event: `trip.started`
- Event: `trip.finished` → billing / analytics / notification subscribers react

7. Correções imediatas que recomendo aplicar (prioridade)

- A: Corrigir `apps/dispatch/src/main.ts` para chamar `startAllMicroservices()` (ou usar `createMicroservice` se for apenas microservice). Veja [apps/dispatch/src/main.ts](apps/dispatch/src/main.ts).
- B: Ajustar env `KAFKA_BROKERS` em `apps/trip/.env` / `apps/dispatch/.env` para apontar para broker correto (`broker:29092` em docker).
- C: Padronizar `TRIP_PATTERNS` em [libs/common/src/modules/trip/trip.patterns.ts](libs/common/src/modules/trip/trip.patterns.ts) (corrigir ESTIMATE).
- D: Padronizar payload/event envelope em todo produtor (`trip`) e documentar schema.
- E: Decidir onde você precisa de particionamento por chave e, se necessário, criar produtor baseado em `kafkajs` para enviar `key`.

8. Exemplo rápido de envelope + consumer idempotente (pseudocódigo)

- Producer:
  ```json
  {
    "eventId":"uuid",
    "eventName":"trip.requested",
    "occurredAt":"2026-03-16T...",
    "correlationId":"uuid",
    "data": { "id":"...", "passengerId":"...", "origin":"...", ... }
  }
  ```
- Consumer (pseudo):
  - Parse message
  - If eventId already processed → ack and return
  - Process (find drivers)
  - On success mark eventId processed
  - On permanent failure send to DLQ topic

9. Recursos e comandos para rodar localmente (dicas)

- Subir infra (docker-compose):
  ```bash
  docker-compose up -d
  ```
- Conferir Kafka UI: http://localhost:8080 (já configurado no docker-compose)
- Variáveis dentro dos containers devem apontar `KAFKA_BROKERS=broker:29092`.

Próximos passos que eu posso fazer por você (escolha uma):

- A) Gerar um PR com as correções propostas (ex.: `apps/dispatch/src/main.ts` startAllMicroservices, atualizar `clients.module.ts` e .env.example).
- B) Gerar um README de eventos (tabela comando vs evento, contratos de payload).
- C) Implementar envelope + produtor `kafkajs` para enviar `key` e criar DLQ básico.
- D) Validar e corrigir `TRIP_PATTERNS` nos libs.

Qual desses você quer que eu faça primeiro?- Conferir Kafka UI: http://localhost:8080 (já configurado no docker-compose)

- Variáveis dentro dos containers devem apontar `KAFKA_BROKERS=broker:29092`.

Próximos passos que eu posso fazer por você (escolha uma):

- A) Gerar um PR com as correções propostas (ex.: `apps/dispatch/src/main.ts` startAllMicroservices, atualizar `clients.module.ts` e .env.example).
- B) Gerar um README de eventos (tabela comando vs evento, contratos de payload).
- C) Implementar envelope + produtor `kafkajs` para enviar `key` e criar DLQ básico.
- D) Validar e corrigir `TRIP_PATTERNS` nos libs.

Qual desses você quer que eu faça primeiro?
