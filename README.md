### Microsserviços - Estrutura Proposta para o Ecossistema

#### 1. GATEWAY DE API (API Gateway)

Este será o **ponto de entrada único** para todas as requisições dos clientes (app do passageiro, app do motorista, painel web).

- **Responsabilidades:** Roteamento de requisições para os serviços corretos, autenticação inicial, rate limiting (limitação de requisições) e agregação de respostas.

---

#### 2. SERVIÇO DE USUÁRIOS E AUTENTICAÇÃO (User & Auth Service)

Gerencia todas as informações de usuários (passageiros e motoristas).

- **Responsabilidades:** Cadastro, login (geração de tokens JWT), gerenciamento de perfis, recuperação de senha.
- **Exemplo de Endpoints:** `POST /register`, `POST /login`, `GET /users/me`.
- **Casos de Uso:**
  - Um novo usuário (passageiro/motorista) deve poder se cadastrar.
  - Um usuário existente deve poder fazer login e receber um token de acesso (JWT).
  - O usuário logado deve poder visualizar suas próprias informações.
  - O usuário logado deve poder atualizar seu perfil (nome, telefone, etc.).
  - (Opcional) O usuário deve poder solicitar a redefinição de senha.

- **Endpoints (Rotas HTTP):**
  - `POST /auth/register` - Cria um novo usuário.
  - `POST /auth/login` - Autentica um usuário e retorna um JWT.
  - `GET /users/me` - Retorna os dados do usuário logado (requer autenticação).
  - `PATCH /users/me` - Atualiza os dados do usuário logado (requer autenticação).
  - `GET /users/{id}` - (Rota interna) Permite que outros serviços busquem dados de um usuário pelo ID.

---

#### 3. SERVIÇO DE CORRIDAS (Trip Service)

O coração do sistema. Ele gerencia todo o ciclo de vida de uma viagem.

- **Responsabilidades:** Receber solicitações de corrida, gerenciar o estado da corrida (solicitada, aceita, em andamento, finalizada, cancelada), calcular estimativas de preço.
- **Exemplo de Endpoints:** `POST /trips`, `GET /trips/{id}`, `POST /trips/{id}/cancel`.
- **Casos de Uso:**
  - Um passageiro deve poder solicitar uma estimativa de preço para uma rota.
  - Um passageiro deve poder solicitar uma nova corrida.
  - Um usuário (passageiro ou motorista) deve poder ver os detalhes de uma corrida específica.
  - Um usuário deve poder ver seu histórico de corridas.
  - Um passageiro deve poder cancelar uma solicitação de corrida.
  - Um motorista deve poder aceitar uma oferta de corrida.
  - Um motorista deve poder indicar que iniciou a corrida (buscou o passageiro).
  - Um motorista deve poder indicar que finalizou a corrida.
- **Endpoints (Rotas HTTP):**
  - `POST /trips/estimate` - Calcula e retorna o preço estimado.
  - `POST /trips` - Cria uma nova solicitação de corrida.
  - `GET /trips/{id}` - Retorna detalhes de uma corrida específica.
  - `GET /trips` - Retorna uma lista de corridas do usuário logado.
  - `POST /trips/{id}/cancel` - Cancela uma corrida (pelo passageiro ou motorista, com regras de negócio).
  - `POST /trips/{id}/accept` - (Ação do motorista) Aceita a corrida.
  - `POST /trips/{id}/start` - (Ação do motorista) Marca o início da corrida.
  - `POST /trips/{id}/finish` - (Ação do motorista) Marca o fim da corrida.

---

#### 4. SERVIÇO DE DISPATCH E MATCHING (Dispatch & Matching Service)

A "mágica" que conecta passageiros e motoristas.

- **Responsabilidades:** Receber uma nova solicitação de corrida do _Serviço de Corridas_, encontrar os motoristas mais próximos e disponíveis, e enviar a oferta de corrida para eles.
- **Casos de Uso:**
  - Encontrar motoristas disponíveis em um raio específico de um local de partida.
  - Selecionar o melhor motorista para uma solicitação de corrida.
  - Gerenciar o status de disponibilidade dos motoristas (online/offline).
- **Interface (Eventos e Rotas Internas):**
  - **Consumidor de Eventos (Listener):**
    - Escuta o evento `TRIP_REQUESTED` vindo do **Serviço de Corridas** (via RabbitMQ/Kafka). Ao receber, inicia o processo de matching.
  - **Produtor de Eventos (Publisher):**
    - Publica o evento `TRIP_OFFERED_TO_DRIVER` para notificar um motorista.
    - Publica o evento `NO_DRIVERS_AVAILABLE` se ninguém for encontrado.
  - **Endpoints (Rotas HTTP Internas):**
    - `POST /drivers/{driverId}/status` - Para um motorista se marcar como `online` ou `offline`.

---

#### 5. SERVIÇO DE LOCALIZAÇÃO (Location Service)

Gerencia a localização em tempo real de motoristas e passageiros.

- **Responsabilidades:** Receber e armazenar as coordenadas geográficas dos motoristas em tempo real. Fornecer a localização dos motoristas para o serviço de _Matching_.
- **Tecnologia Sugerida:** **WebSockets** ou **gRPC** para comunicação de alta frequência.
- **Casos de Uso:**
  - Receber atualizações contínuas da localização de um motorista ativo.
  - Fornecer a localização atual de um motorista específico para um passageiro durante a corrida.
  - Fornecer uma lista de motoristas próximos para o **Serviço de Matching**.
- **Interface (WebSockets e Rotas Internas):**
  - **Eventos WebSocket:**
    - `driver:update_location` - Evento enviado pelo app do motorista com suas novas coordenadas `{ lat, lng }`.
    - `passenger:driver_location` - Evento enviado para o app do passageiro com a localização atualizada do motorista atribuído à sua corrida.
  - **Endpoints (Rotas HTTP Internas):**
    - `GET /drivers/nearby?lat=...&lng=...&radius=...` - Rota crucial para o **Serviço de Matching** consultar os motoristas próximos.

---

#### 6. SERVIÇO DE PAGAMENTOS (Payment Service)

Lida com todo o fluxo financeiro.

- **Responsabilidades:** Processar o pagamento ao final da corrida, integrar com um gateway de pagamento (ex: Stripe, Mercado Pago - você pode simular isso), gerenciar a "carteira" (Wallet) do usuário.
- **Exemplo de Endpoints:** `POST /payments/charge`, `GET /wallet/balance`.
- **Casos de Uso:**
  - Um usuário deve poder adicionar um método de pagamento (ex: cartão de crédito).
  - Um usuário deve poder listar seus métodos de pagamento salvos.
  - O sistema deve poder processar a cobrança de uma corrida finalizada.
  - Um usuário deve poder ver seu histórico de transações.
- **Interface (Eventos e Rotas HTTP):**
  - **Consumidor de Eventos (Listener):**
    - Escuta o evento `TRIP_COMPLETED` vindo do **Serviço de Corridas**. Ao receber, inicia o processo de cobrança.
  - **Endpoints (Rotas HTTP):**
    - `POST /payment-methods` - Adiciona um novo método de pagamento para o usuário.
    - `GET /payment-methods` - Lista os métodos de pagamento do usuário.
    - `GET /transactions` - Retorna o histórico de pagamentos do usuário.
    - `GET /wallet` - Retorna o saldo da carteira do usuário (se aplicável).

#### 7. SERVIÇO DE NOTIFICAÇÕES (Notification Service)

Responsável por enviar comunicações para os usuários.

- **Responsabilidades:** Enviar notificações push, SMS ou e-mails para eventos como "Motorista a caminho", "Corrida finalizada", "Recibo enviado".
- **Casos de Uso:**
  - Enviar uma notificação (push, SMS, etc.) para um usuário específico.
- **Interface (Eventos ou Rotas Internas):**
  - **Consumidor de Eventos (Listener):**
    - Pode escutar diversos eventos do sistema (ex: `DRIVER_ARRIVED`, `TRIP_FINISHED_RECEIPT`) para disparar notificações.
  - **Endpoints (Rotas HTTP Internas):**
    - `POST /notifications/send` - Uma rota genérica que outros serviços podem chamar, passando no corpo da requisição o `userId`, a `mensagem` e o `canal` (push, sms, email).

---

#### 8. TechStack

- **Backend dos Microsserviços:** **Node.js** com **NestJS**.
  - **Vantagens:**
    - **TypeScript:** Você ganha tipagem estática, o que ajuda a evitar bugs e melhora a organização do código em projetos grandes.
    - **Arquitetura Modular:** A estrutura de Módulos, Controladores e Serviços do NestJS força uma boa organização do código, o que é perfeito para microsserviços.
    - **Injeção de Dependência:** Facilita muito os testes e o desacoplamento de componentes.
- **Banco de Dados (Conexão):**
  - Para **PostgreSQL**, a integração com **TypeORM** (que é o padrão do NestJS) é excelente e muito poderosa. Você define suas entidades como classes e o TypeORM cuida do resto.
  - Para **MongoDB**, a integração com **Mongoose** também é nativa e bem documentada no NestJS.
- **Comunicação entre Serviços:**
  - **REST (Síncrona):** Continua sendo o padrão. O NestJS facilita a criação de controllers REST de forma muito limpa.
  - **Mensageria (Assíncrona):** Aqui o NestJS brilha! Ele tem um módulo de microerviços (`@nestjs/microservices`) com suporte nativo para "transporters" como **RabbitMQ** e **Kafka**. A configuração para publicar e consumir eventos se torna muito mais simples e integrada à framework.
  - **WebSockets:** Para o _Serviço de Localização_, o NestJS também tem um módulo nativo (`@nestjs/websockets`) que torna a implementação de um servidor WebSocket muito organizada.

---

## Fluxo de uma Solicitação de Corrida

Para ficar mais claro, veja como os serviços se comunicariam:

1. **Login:** O _Frontend_ envia as credenciais para o _API Gateway_, que repassa para o _Serviço de Usuários_ e retorna um token JWT.
2. **Solicitação da Corrida:** O _Frontend_ envia a localização de partida e destino para o _API Gateway_ (`POST /trips`).
3. O _Gateway_ repassa a requisição para o _Serviço de Corridas_.
4. O _Serviço de Corridas_ cria a corrida com status "solicitada" e publica um evento `TRIP_REQUESTED` no **RabbitMQ**.
5. O _Serviço de Matching_ consome esse evento. Ele consulta o _Serviço de Localização_ para encontrar motoristas próximos.
6. O _Serviço de Matching_ envia a oferta para os motoristas (através do _Serviço de Notificação_ via WebSocket).
7. Quando um motorista aceita, o _Serviço de Matching_ atualiza o status no _Serviço de Corridas_ e notifica o passageiro.
8. Durante a viagem, o _Serviço de Localização_ é atualizado constantemente.
9. Ao final, o _Serviço de Corridas_ publica um evento `TRIP_COMPLETED`.
10. O _Serviço de Pagamentos_ consome esse evento e processa a cobrança.

---

## Roadmap

1.  **Milestone 1 (O Básico):** Comece com 3 serviços: **API Gateway**, **Serviço de Usuários** (com auth JWT) e **Serviço de Corridas** (só o CRUD inicial). Faça eles se comunicarem via REST.
2.  **Milestone 2 (A Lógica Principal):** Adicione o **Serviço de Matching** e o **Serviço de Localização** (pode começar simulando a localização). Introduza o **RabbitMQ** para a comunicação assíncrona entre Corridas e Matching.
3.  **Milestone 3 (Finalizando o Fluxo):** Implemente o **Serviço de Pagamentos** e o **Serviço de Notificações**.
4.  **Milestone 4 (DevOps):** Coloque todos os serviços em contêineres com **Docker** e crie um `docker-compose.yml` para subir todo o ambiente com um único comando. Crie um pipeline básico no **GitHub Actions**.
