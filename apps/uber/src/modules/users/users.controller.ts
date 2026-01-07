import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { IdDto } from '@app/common/shared/dto/idDto.dto';
import { RegisterDto } from '@app/common/modules/auth/dto/register.dto';
import { LoginDto } from '@app/common/modules/auth/dto/login.dto';
import { GatewayAuthGuard } from '../../shared/guards/gateway.auth.guard';

import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Users')
@UseGuards(GatewayAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
    return this.usersService.register(registerDto);
  }

  @Post('/login')
  login(@Body() loginDto: LoginDto) {
    return this.usersService.login(loginDto);
  }
  @Get('/me')
  findOne(@Body() idDto: IdDto) {
    return this.usersService.findOne(idDto.id);
  }

  @Patch('/me')
  async update(@Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(updateUserDto);
  }

  @Get('/:id')
  findById(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
}
