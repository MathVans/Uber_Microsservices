import { Controller, UseFilters } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GrpcMethod, MessagePattern, Payload } from '@nestjs/microservices';
import { RegisterDto } from '@app/common/modules/auth/dto/register.dto';
import { LoginDto } from '@app/common/modules/auth/dto/login.dto';
import { JwtToken } from '@app/common/shared/interfaces/jwt-token.interface';
import type {
  AuthenticationServiceController,
  LoginRequest,
  RegisterRequest,
} from '@app/common/proto/auth';

@Controller()
export class AuthController implements AuthenticationServiceController {
  constructor(private readonly authService: AuthService) {}
  @GrpcMethod('AuthenticationService', 'register')
  async register(registerDto: RegisterRequest): Promise<JwtToken> {
    return this.authService.register(registerDto);
  }

  @GrpcMethod('AuthenticationService', 'login')
  async login(loginDto: LoginRequest): Promise<JwtToken> {
    return this.authService.login(loginDto);
  }
}
