import {
    IsEmail,
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
}
