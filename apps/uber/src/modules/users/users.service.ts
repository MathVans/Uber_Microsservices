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

@Injectable()
export class UsersService {
  constructor(@Inject('USERS_CLIENT') private userClient: ClientProxy) {}
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
