import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "../users/entities/user.entity";
import { Model } from "mongoose";
import { RegisterDto } from "./dto/register.dto";

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async register(registerDto: RegisterDto) {
    const existingUser = await this.findByEmail(registerDto.email);

    if (existingUser) {
      // Throw Error
    }

    const createdUser = await this.userModel.create({ ...registerDto });

    await createdUser.save();

    return createdUser;
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }
}
