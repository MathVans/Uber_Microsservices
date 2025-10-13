import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { RegisterDto } from "./dto/register.dto";
import { ClientProxy } from "@nestjs/microservices";
import { LoginDto } from "./dto/login.dto";
import { AUTH_PATTERNS } from "@app/common/modules/auth/auth.patterns";
import { lastValueFrom, observable } from "rxjs";

@Injectable()
export class AuthService {
  constructor(@Inject("USERS_CLIENT") private clientProxy: ClientProxy) {}

  async register(registerDto: RegisterDto) {
    const observable = await this.clientProxy.send(
      AUTH_PATTERNS.REGISTER,
      registerDto,
    );
    try {
      return lastValueFrom(observable);
    } catch (error) {
      throw new Error(error);
    }
  }

  async login(loginDto: LoginDto) {
    return await this.clientProxy.send(AUTH_PATTERNS.LOGIN, loginDto);
  }
}
