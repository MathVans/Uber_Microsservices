import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from '@app/common/modules/user/dto/update-user.dto';
import { User } from './entities/user.entity';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new RpcException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Usuário não encontrado',
      });
    }

    return user;
  }

  async update(updateUserDto: UpdateUserDto): Promise<User> {
    const { id, ...data } = updateUserDto;
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
    updatedUser.role = updateUserDto.role
      ? updateUserDto.role
      : updatedUser.role;

    await this.userRepository.save(updatedUser);

    return updatedUser;
  }
}
