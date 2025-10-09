import { Controller } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import { UserRegisterDTO } from "./dto/userRegister.dto";

@Controller("auth")
export class AuthController {
    @MessagePattern("auth.register")
    register(data: UserRegisterDTO) {
        
    }
}
