import {
    IsEmail,
    IsInt,
    IsMongoId,
    IsNotEmpty,
    IsOptional,
    IsString,
    MinLength,
} from "class-validator";

export class UserDTO {
    @IsMongoId({ message: "O ID deve ser um ObjectId válido do MongoDB." })
    @IsOptional() // O ID é opcional pois será gerado automaticamente
    id: string;

    @IsEmail({}, { message: "O e-mail informado é inválido." })
    @IsNotEmpty({ message: "O campo e-mail é obrigatório." })
    email: string;

    @IsString()
    @IsNotEmpty({ message: "O campo senha é obrigatório." })
    @MinLength(8, { message: "A senha deve ter no mínimo 8 caracteres." })
    password: string;

    @IsString()
    @IsNotEmpty({ message: "O campo nome é obrigatório." })
    @MinLength(2, { message: "O nome deve ter no mínimo 2 caracteres." })
    name: string;
}
