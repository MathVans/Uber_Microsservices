import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { IdDto } from '@app/common/shared/dto/idDto.dto';
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

  @Get('/me')
  findOne(@Req() req) {
    const userId = req.headers['X_User_Id'];
    return this.usersService.findOne(userId);
  }

  @Patch('/me')
  async update(@Body() updateUserDto: UpdateUserDto, @Req() req) {
    const userId = req.headers['X_User_Id'];
    return await this.usersService.update(userId, updateUserDto);
  }

  @Get('/:id')
  findById(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
}
