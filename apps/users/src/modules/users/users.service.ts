import { Injectable, NotFoundException } from "@nestjs/common";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { User, UserDocument } from "./entities/user.entity";
import { UserResponseDto } from "../../shared/common/dto/user-response.dto";

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException("Usuário não encontrado!");
    }

    return user;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.userModel.findByIdAndUpdate(id, {
      ...updateUserDto,
    });

    if (!user) {
      throw new NotFoundException("Usuário não encontrado!");
    }

    user.save();
    return user;
  }
}
