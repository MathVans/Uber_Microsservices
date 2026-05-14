import { HttpStatus, Injectable } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { RegisterDto } from '@app/common/modules/auth/dto/register.dto';
import { LoginDto } from '@app/common/modules/auth/dto/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtToken } from '@app/common/shared/interfaces/jwt-token.interface';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async register(registerDto: RegisterDto): Promise<JwtToken> {
    const existingUser = await this.userRepository.findOneBy({
      email: registerDto.email,
    });

    if (existingUser) {
      throw new RpcException({
        code: HttpStatus.CONFLICT,
        message: "User Already Exist's",
      });
    }

    const newUser = await this.userRepository.create({ ...registerDto });

    const createdUser = await this.userRepository.save(newUser);

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
    const user = await this.userRepository.findOne({
      where: { email: loginData.email },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        password: true,
      },
    });

    if (!user || !user.password) {
      throw new RpcException({
        code: HttpStatus.UNAUTHORIZED,
        message: 'Credenciais inválidas',
      });
    }

    const isPasswordMatching = await bcrypt.compare(
      loginData.password,
      user.password,
    );

    if (!isPasswordMatching) {
      throw new RpcException({
        code: HttpStatus.UNAUTHORIZED,
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
}
