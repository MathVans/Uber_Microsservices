import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from '@app/common/modules/user/dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './entities/user.entity';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findOne(id: string): Promise<User> {
    try {
      const user = await this.userModel.findById(id);

      if (!user) {
        throw new RpcException({
          status: HttpStatus.NOT_FOUND,
          message: 'Usuário não encontrado',
        });
      }

      return user;
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error,
      });
    }
  }

  async update(updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const { id, ...data } = updateUserDto;
      const updatedUser = await this.userModel
        .findByIdAndUpdate(id, data, { new: true })
        .exec();

      if (!updatedUser) {
        throw new RpcException({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Usuário não encontrado',
        });
      }

      return updatedUser;
    } catch (error) {
      throw new RpcException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        error,
      });
    }
  }
}
