import { Test, TestingModule } from "@nestjs/testing";
import { TripService } from "./trip.service";
import { ConfigService } from "@nestjs/config";
import { HttpService } from "@nestjs/axios";
import { getModelToken } from "@nestjs/mongoose";
import { Trip } from "./entities/trip.entity";
import { EstimateTripDto } from "@app/common/modules/trip/dto/estimate-trip.dto";
import { of } from "rxjs";
import { Model } from "mongoose";

// 1. Mocks (simulações) das dependências
const mockHttpService = {
  get: jest.fn(), // Vamos simular a função 'get'
};
const mockConfigService = {
  get: jest.fn().mockReturnValue("AIzaSyAp5rFT2vDOePu-NChNdlS4gTeFi7e4EOc"), // Simula o retorno de uma chave
};
const mockTripModel = {}; // Objeto vazio, só para o provider funcionar

// 2. Mock dos dados de entrada (DTO)
const mockEstimateDto: EstimateTripDto = {
  startLocation: { type: "Point", coordinates: [-46.633300, -23.55052] },
  endLocation: { type: "Point", coordinates: [-46.633310, -23.56] },
};

// 3. Mock da resposta do Google que esperamos
const mockGoogleResponse = {
  status: "OK",
  routes: [
    {
      legs: [
        {
          distance: { text: "10 km", value: 10000 }, // 10km
          duration: { text: "10 mins", value: 600 }, // 10 min
        },
      ],
    },
  ],
};

// --- Início dos Testes ---
describe("TripService", () => {
  let service: TripService;
  let httpService: HttpService;

  // A Configuração (beforeEach) é necessária por causa da Injeção de Dependência
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TripService,
        // Fornecemos nossos mocks no lugar dos serviços reais
        { provide: HttpService, useValue: mockHttpService },
        { provide: ConfigService, useValue: mockConfigService },
        {
          provide: getModelToken(Trip.name),
          useValue: mockTripModel as Model<Trip>,
        },
      ],
    }).compile();

    service = module.get<TripService>(TripService);
    httpService = module.get<HttpService>(HttpService);
    jest.clearAllMocks(); // Limpa os mocks antes de cada teste
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  // --- Teste simples para o estimate ---
  it("deve retornar uma estimativa válida (Caminho Feliz)", async () => {
    const result = await service.estimate(mockEstimateDto);

    expect(result.estimatedPrice).toBe(21.6);
    expect(result.distance).toBe("10 km");
    expect(result.duration).toBe("10 mins");
  });
});
