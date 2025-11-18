import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { User } from '../users/entities/user.entity';
import { RpcException } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';
import { Role } from '@app/common/shared/enum/role.enum';

describe('AuthService', () => {
  let service: AuthService;
  let userModel: any;
  let jwtService: JwtService;

  const TOKEN_MOCK = 'token_jwt_gerado_pelo_mock';
  const SENHA = 'MinhaSenhaForte123';
  const SENHA_HASH =
    '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGqa3196';

  const mockBcryptCompare = jest.fn();
  const mockBcryptHash = jest.fn();

  const mockJwtService = {
    sign: jest.fn().mockReturnValue(TOKEN_MOCK),
  };

  jest.mock('bcrypt', () => ({
    __esModule: true,
    compare: mockBcryptCompare,
    hash: mockBcryptHash,
  }));

  const mockUserModel = {
    create: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userModel = module.get(getModelToken(User.name));
    jwtService = module.get<JwtService>(JwtService);

    jest.clearAllMocks();
  });

  describe('register', () => {
    it('deve registrar um novo usuário', async () => {
      const registerDto = {
        name: 'alisson',
        email: 'alisson.lucas@example.com',
        password: 'Secure123@',
        role: Role.DRIVER,
      };

      userModel.findOne.mockReturnValue({
        exec: jest.fn().mockReturnValue(null),
      });

      const saveMock = jest.fn().mockReturnValue(true);

      const mockCreatedUser = {
        ...registerDto,
        id: 'any_id',
        save: saveMock, // Verificar se o objeto tem o save.
      };

      userModel.create.mockReturnValue(mockCreatedUser);

      const result = await service.register(registerDto);

      expect(userModel.findOne).toHaveBeenCalledWith({
        email: registerDto.email,
      });
      expect(userModel.create).toHaveBeenCalled();
      expect(saveMock).toHaveBeenCalled();
      expect(result).toHaveProperty('accessToken');
    });
  });

  describe('login', () => {
    it('deve realizar o login de um usuário', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: SENHA,
      };

      mockBcryptCompare.mockResolvedValue(true);

      const mockUserFound = {
        email: 'test@example.com',
        password: SENHA_HASH,
        id: '1',
        name: 'teste',
        role: 'driver',
      };

      userModel.findOne.mockReturnValue({
        select: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockUserFound),
        }),
        exec: jest.fn().mockResolvedValue(mockUserFound),
      });

      const result = await service.login(loginDto);

      expect(result.accessToken).toBe(TOKEN_MOCK);

      expect(mockBcryptCompare).toHaveBeenCalledWith(
        loginDto.password,
        SENHA_HASH,
      );
    });

    it('shoud throw an error if the user does not exists', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'Secure123@',
      };

      userModel.findOne.mockReturnValue({
        select: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(null),
        }),
      });
      await expect(service.login(loginDto)).rejects.toThrow(RpcException);
    });
  });
});
