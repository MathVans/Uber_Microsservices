import {
  Inject,
  Injectable,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { RegisterDto } from '@app/common/modules/auth/dto/register.dto';
import { LoginDto } from '@app/common/modules/auth/dto/login.dto';
import { AUTH_PATTERNS } from '@app/common/modules/auth/auth.patterns';

@Injectable()
export class AuthService {
  constructor(@Inject('USERS_CLIENT') private userClient: ClientProxy) {}

  async register(registerDto: RegisterDto) {
    const observable = await this.userClient.send(
      AUTH_PATTERNS.REGISTER,
      registerDto,
    );
    return lastValueFrom(observable);
  }

  async login(loginDto: LoginDto) {
    return await this.userClient.send(AUTH_PATTERNS.LOGIN, loginDto);
  }
}
