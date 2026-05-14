import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { UsersService } from './users.service';
import {
  type FindOneRequest,
  type UpdateRequest,
  IdentityController,
  IdentityControllerMethods,
  UserResponse,
} from '@app/common/proto/users';

@Controller()
@IdentityControllerMethods()
export class UsersController implements IdentityController {
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
