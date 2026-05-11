import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class UserDTO {
  @IsString({ message: 'O ID deve ser uma string válida.' })
  @IsOptional() // O ID é opcional pois será gerado automaticamente
  id: string;

  @IsEmail({}, { message: 'O e-mail informado é inválido.' })
  @IsNotEmpty({ message: 'O campo e-mail é obrigatório.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'O campo senha é obrigatório.' })
  @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres.' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'O campo nome é obrigatório.' })
  @MinLength(2, { message: 'O nome deve ter no mínimo 2 caracteres.' })
  name: string;
}
