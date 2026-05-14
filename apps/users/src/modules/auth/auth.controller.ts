import { Controller, UseFilters } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GrpcMethod, MessagePattern, Payload } from '@nestjs/microservices';
import { JwtToken } from '@app/common/shared/interfaces/jwt-token.interface';
import { AuthenticationControllerMethods } from '../../../../../libs/common/src/proto/auth';
import {
  AuthenticationController,
  type LoginRequest,
  type RegisterRequest,
} from '@app/common/proto/auth';

@Controller()
@AuthenticationControllerMethods()
export class AuthController implements AuthenticationController {
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
