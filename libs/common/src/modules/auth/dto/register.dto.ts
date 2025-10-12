import {
    IsEmail,
    IsNotEmpty,
    IsString,
    IsStrongPassword,
    MinLength,
} from "class-validator";
import { CreateUserDto } from "../../user/dto/create-user.dto";

export class RegisterDto extends CreateUserDto {
}
