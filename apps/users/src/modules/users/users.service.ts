import { Injectable, NotFoundException } from "@nestjs/common";
import { UpdateUserDto } from "@app/common/modules/user/dto/update-user.dto";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { User, UserDocument } from "./entities/user.entity";
import { UserResponseDto } from "../../../../../libs/common/src/modules/user/dto/user-response.dto";

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
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const { id, ...data } = updateUserDto;
    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      data,
      { new: true },
    ).exec();

    if (!updatedUser) {
      throw new NotFoundException("Usuário não encontrado!");
    }

    return updatedUser;
  }
}
