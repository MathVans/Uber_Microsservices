import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "../users/entities/user.entity";
import { Model } from "mongoose";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import * as bcrypt from "bcrypt";

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

  async login(loginData: LoginDto) {
    const user = await this.findByEmail(loginData.email);

    if (!user) {
      throw new Error(); // UnauthorizedException('Credenciais inválidas');
    }

    const isPasswordMatching = await bcrypt.compare(
      loginData.password,
      user.password,
    );

    if (!isPasswordMatching) {
      throw new Error(); //UnauthorizedException("Credenciais inválidas");
    }

    const { password, ...result } = user.toObject();
    return result;
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }
}
