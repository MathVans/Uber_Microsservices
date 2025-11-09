import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { UpdateUserDto } from './dto/update-user.dto';
import { lastValueFrom } from 'rxjs';
import { USERS_PATTERNS } from '@app/common/modules/user/users.patterns';
import { RegisterDto } from '@app/common/modules/auth/dto/register.dto';
import { LoginDto } from '@app/common/modules/auth/dto/login.dto';
import { AUTH_PATTERNS } from '@app/common/modules/auth/auth.patterns';

@Injectable()
export class UsersService {
  constructor(@Inject('USERS_CLIENT') private userClient: ClientProxy) {}

  async register(registerDto: RegisterDto) {
    const observable = await this.userClient.send(
      AUTH_PATTERNS.REGISTER,
      registerDto,
    );
    return lastValueFrom(observable);
  }

  async login(loginDto: LoginDto) {
    return await this.userClient.send(AUTH_PATTERNS.LOGIN, loginDto);
  }
  findOne(id: string) {
    return this.userClient.send(USERS_PATTERNS.FIND_ONE, id);
  }

  async update(updateUserDto: UpdateUserDto): Promise<any> {
    const observable = this.userClient.send(
      USERS_PATTERNS.UPDATE,
      updateUserDto,
    );

    try {
      return await lastValueFrom(observable);
    } catch (error) {
      const errorData = error.message;

      if (
        Array.isArray(errorData) &&
        errorData[0] &&
        errorData[0].constraints
      ) {
        throw new BadRequestException({
          statusCode: 400,
          message: 'Validation failed',
          details: errorData,
        });
      }

      if (
        errorData &&
        typeof errorData === 'string' &&
        errorData.includes('Not Found')
      ) {
        throw new NotFoundException(errorData);
      }

      throw new InternalServerErrorException(
        errorData || 'Microservice Internal Error',
      );
    }
  }
}
