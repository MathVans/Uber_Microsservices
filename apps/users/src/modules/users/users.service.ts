import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from '@app/common/modules/user/dto/update-user.dto';
import { User } from './entities/user.entity';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindOneRequest, UpdateRequest } from '@app/common/proto/users';
import { UserResponse } from '@app/common/modules/user/dto/user.response';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findOne(request: FindOneRequest): Promise<UserResponse> {
    const user = await this.userRepository.findOneBy(request);

    if (!user) {
      throw new RpcException({
        code: HttpStatus.NOT_FOUND,
        message: 'Usuário não encontrado',
      });
    }

    return user;
  }

  async update(updateUserDto: UpdateRequest): Promise<User> {
    const { id } = updateUserDto;
    const updatedUser = await this.userRepository.findOneBy({ id });

    if (!updatedUser) {
      throw new RpcException({
        code: HttpStatus.NOT_FOUND,
        message: 'Usuário não encontrado',
      });
    }

    updatedUser.name = updateUserDto.name
      ? updateUserDto.name
      : updatedUser.name;
    updatedUser.role = updateUserDto.role
      ? updateUserDto.role
      : updatedUser.role;

    await this.userRepository.save(updatedUser);

    return updatedUser;
  }
}
