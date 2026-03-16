import { Body, Controller, Post } from '@nestjs/common';
import { RegisterDto } from '@app/common/modules/auth/dto/register.dto';
import { LoginDto } from '@app/common/modules/auth/dto/login.dto';
import { AuthService } from './auth.service';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Cadastrar um novo usuário',
    description: 'Esta rota realiza o cadastro de um novo usuário no sistema.',
  })
  @ApiOkResponse({
    description: 'Usuário cadastrado com sucesso!',
    example: {
      accessToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IkpvZS5Kb25lc0BleGFtcGxlLmNvbSIsImlkIjoiNjk1ZWQxMjQxNmM4YjJmODY4Y2UzMWE5Iiwicm9sZSI6ImRyaXZlciIsImlhdCI6MTc2NzgyMTYwNCwiZXhwIjoxNzY3OTA4MDA0fQ.VzZ118V9TqYJnEWpfyjxF5gKQq4Gogrlcl0JGIIXno0',
      name: 'Joe Jones',
      email: 'Joe.Jones@example.com',
      role: 'driver',
      id: '695ed12416c8b2f868ce31a9',
    },
  })
  @ApiBody({
    type: RegisterDto,
    examples: {
      exemplo1: {
        summary: 'Registrar usuário',
        value: {
          name: 'Joe Jones',
          email: 'Joe.Jones@example.com',
          password: 'JoeJones123@',
          role: 'driver',
        },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'ID inválido fornecido' })
  @Post('/register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('/login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
