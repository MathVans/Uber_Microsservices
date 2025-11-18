import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../users/entities/user.entity';
import { Model } from 'mongoose';
import { RegisterDto } from '@app/common/modules/auth/dto/register.dto';
import { LoginDto } from '@app/common/modules/auth/dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtToken } from '@app/common/shared/interfaces/jwt-token.interface';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}
  async register(registerDto: RegisterDto): Promise<JwtToken> {
    const existingUser = await this.findByEmail(registerDto.email);

    if (existingUser) {
      throw new RpcException({
        statusCode: HttpStatus.CONFLICT,
        message: 'Credenciais inválidas',
      });
    }

    const createdUser = await this.userModel.create({ ...registerDto });

    await createdUser.save();

    const payload = {
      email: createdUser.email,
      id: createdUser.id,
      role: createdUser.role,
    };

    const jwtToken = await this.jwtService.sign(payload);

    return {
      accessToken: jwtToken,
      name: createdUser.name,
      email: createdUser.email,
      role: createdUser.role,
      id: createdUser.id,
    };
  }

  async login(loginData: LoginDto): Promise<JwtToken> {
    const user = await this.userModel
      .findOne({ email: loginData.email })
      .select('+password')
      .exec();

    if (!user || !user.password) {
      throw new RpcException({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Credenciais inválidas',
      });
    }

    const isPasswordMatching = await bcrypt.compare(
      loginData.password,
      user.password,
    );

    if (!isPasswordMatching) {
      throw new RpcException({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Credenciais inválidas',
      });
    }

    const payload = { email: user.email, id: user.id, role: user.role };

    const jwtToken = await this.jwtService.sign(payload);

    return {
      accessToken: jwtToken,
      name: user.name,
      email: user.email,
      role: user.role,
      id: user.id,
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userModel.findOne({ email }).exec();
  }
}
