import { Inject, Injectable } from "@nestjs/common";
import { RegisterDto } from "./dto/register.dto";
import { ClientProxy } from "@nestjs/microservices";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
  constructor(@Inject("USERS_CLIENT") private clientProxy: ClientProxy) {}

  async register(registerDto: RegisterDto) {
    return await this.clientProxy.send("auth.register", registerDto);
  }

  async login(loginDto: LoginDto) {
    return await this.clientProxy.send("auth.login", loginDto);
  }
}
