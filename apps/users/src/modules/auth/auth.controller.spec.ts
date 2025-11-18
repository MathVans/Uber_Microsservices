import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Role } from '@app/common/shared/enum/role.enum';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    register: jest.fn((dto) => {
      return {
        ...dto,
      };
    }),
    login: jest.fn().mockImplementation((dto) => {}),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', async () => {
    expect(
      await controller.register({
        name: 'teste',
        email: 'teste.teste@example.com',
        password: 'Secure123@',
        role: Role.DRIVER,
      }),
    ).toHaveProperty('name', 'teste');
  });

  it('should login a user and return the token', async () => {
    const loginDto = {
      email: 'test@example.com',
      password: 'test',
    };

    const expectedResult = {
      accessToken: 'fake_jwt',
      name: 'teste',
      email: 'teste@example.com',
      role: 'driver',
      id: '691c763d4920b211b8e80eb3',
    };
    mockAuthService.login.mockResolvedValue(expectedResult);

    const result = await controller.login(loginDto);

    expect(result).toEqual(expectedResult);

    expect(service.login).toHaveBeenCalledWith(loginDto);
    
  });
});
