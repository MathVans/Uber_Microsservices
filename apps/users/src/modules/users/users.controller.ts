import { BadRequestException, Controller, UseFilters } from '@nestjs/common';
import { GrpcMethod, MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { UpdateUserDto } from '@app/common/modules/user/dto/update-user.dto';
import { User } from './entities/user.entity';
import {
  type FindOneRequest,
  type UpdateRequest,
  IdentityServiceController,
  IdentityServiceControllerMethods,
  UserResponse,
} from '@app/common/proto/users';

@Controller()
@IdentityServiceControllerMethods()
export class UsersController implements IdentityServiceController {
  constructor(private readonly usersService: UsersService) {}

  @GrpcMethod('UsersService', 'FindOne')
  findOne(request: FindOneRequest): Promise<UserResponse> {
    return this.usersService.findOne(request);
  }

  @GrpcMethod('UsersService', 'Update')
  update(request: UpdateRequest): Promise<UserResponse> {
    return this.usersService.update(request);
  }
}
