import { AUTH_PATTERNS } from '@app/common/modules/auth/auth.patterns';
import { LoginDto } from '@app/common/modules/auth/dto/login.dto';
import { RegisterDto } from '@app/common/modules/auth/dto/register.dto';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(@Inject('USERS_CLIENT') private userClient: ClientProxy) {}

  async register(data: RegisterDto) {
    const response = this.userClient.send(AUTH_PATTERNS.REGISTER, data);
    return await lastValueFrom(response);
  }

  async login(data: LoginDto) {
    const response = this.userClient.send(AUTH_PATTERNS.LOGIN, data);
    return await lastValueFrom(response);
  }
}
