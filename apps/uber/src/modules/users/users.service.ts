import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { type ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import {
  IDENTITY_PACKAGE_NAME,
  IDENTITY_SERVICE_NAME,
  IdentityClient,
  UpdateRequest,
} from '@app/common/proto/users';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService implements OnModuleInit {
  private grpcIdentityService: IdentityClient;

  constructor(
    @Inject(IDENTITY_PACKAGE_NAME) private identityClient: ClientGrpc,
  ) {}
  onModuleInit() {
    this.grpcIdentityService = this.identityClient.getService<IdentityClient>(
      IDENTITY_SERVICE_NAME,
    );
  }

  async findOne(id: string): Promise<any> {
    const response = this.grpcIdentityService.findOne({ id });

    return await lastValueFrom(response);
  }

  async update(id: string, data: UpdateUserDto): Promise<any> {
    const response = this.grpcIdentityService.update({ id, ...data });

    return await lastValueFrom(response);
  }
}
