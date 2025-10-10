import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { AuthService } from "./auth.service";
import { CreateAuthDto } from "./dto/create-auth.dto";
import { UpdateAuthDto } from "./dto/update-auth.dto";

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern("auth.createAuth")
  create(@Payload() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @MessagePattern("auth.findAllAuth")
  findAll() {
    return this.authService.findAll();
  }

  @MessagePattern("auth.findOneAuth")
  findOne(@Payload() id: number) {
    return this.authService.findOne(id);
  }

  @MessagePattern("auth.updateAuth")
  update(@Payload() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(updateAuthDto.id, updateAuthDto);
  }

  @MessagePattern("auth.removeAuth")
  remove(@Payload() id: number) {
    return this.authService.remove(id);
  }
}
