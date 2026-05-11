import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from '@app/common/modules/user/dto/update-user.dto';
import { User } from './entities/user.entity';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  FindOneRequest,
  UpdateRequest,
  UserResponse,
  UserRole,
} from '@app/common/proto/users';
import { Role } from '@app/common/shared/enum/role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findOne(request: FindOneRequest): Promise<UserResponse> {
    const user = await this.userRepository.findOneBy(request);

    if (!user) {
      throw new RpcException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Usuário não encontrado',
      });
    }

    return this.toUserResponse(user);
  }

  async update(updateUserDto: UpdateRequest): Promise<UserResponse> {
    const { id } = updateUserDto;
    const updatedUser = await this.userRepository.findOneBy({ id });

    if (!updatedUser) {
      throw new RpcException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Usuário não encontrado',
      });
    }

    updatedUser.name = updateUserDto.name
      ? updateUserDto.name
      : updatedUser.name;

    const mappedRole = this.toRole(updateUserDto.role);
    if (mappedRole !== undefined) {
      updatedUser.role = mappedRole;
    }

    await this.userRepository.save(updatedUser);

    return this.toUserResponse(updatedUser);
  }

  private toRole(role: UserRole): Role | undefined {
    switch (role) {
      case UserRole.driver:
        return Role.DRIVER;
      case UserRole.rider:
        return Role.RIDER;
      case UserRole.admin:
        return Role.ADMIN;
      default:
        return undefined;
    }
  }

  private toUserResponse(user: User): UserResponse {
    return {
      id: user.id,
      name: user.name,
      role: this.toUserRole(user.role),
    };
  }

  private toUserRole(role: Role): UserRole {
    switch (role) {
      case Role.DRIVER:
        return UserRole.driver;
      case Role.RIDER:
        return UserRole.rider;
      case Role.ADMIN:
        return UserRole.admin;
      default:
        return UserRole.ROLE_UNKNOWN;
    }
  }
}
