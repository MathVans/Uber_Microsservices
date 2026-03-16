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

  async findOne(id: string) {
    const response = this.userClient.send(USERS_PATTERNS.FIND_ONE, id);

    return await lastValueFrom(response);
  }

  async update(updateUserDto: UpdateUserDto): Promise<any> {
    const response = this.userClient.send(USERS_PATTERNS.UPDATE, updateUserDto);

    return await lastValueFrom(response);
  }
}
