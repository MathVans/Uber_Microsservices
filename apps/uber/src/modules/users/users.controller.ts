import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { IdDto } from '@app/common/shared/dto/idDto.dto';
import { RegisterDto } from '@app/common/modules/auth/dto/register.dto';
import { LoginDto } from '@app/common/modules/auth/dto/login.dto';
import { GatewayAuthGuard } from '../../shared/guards/gateway.auth.guard';

@UseGuards(GatewayAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
