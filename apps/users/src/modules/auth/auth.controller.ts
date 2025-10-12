import { Controller } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  @MessagePattern("auth.register")
  async register(@Payload() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @MessagePattern("auth.login")
  async login(@Payload() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
