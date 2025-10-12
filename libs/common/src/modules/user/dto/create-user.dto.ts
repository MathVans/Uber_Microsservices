import { Role } from "@app/common/shared/enum/role.enum";
import {
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsString,
    IsStrongPassword,
    MinLength,
} from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsStrongPassword({
        minLength: 6,
    })
    password: string;

    @IsEnum(Role)
    role: Role;
}
