import { LoginRequest, type RegisterRequest } from '@app/common/proto/auth';
import { LoginDto } from '@app/common/modules/auth/dto/login.dto';
import {
  AUTHENTICATION_PACKAGE_NAME,
  AUTHENTICATION_SERVICE_NAME,
  AuthenticationClient,
} from '@app/common/proto/auth';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { type ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { Metadata } from '@grpc/grpc-js';

@Injectable()
export class AuthService implements OnModuleInit {
  private grpcAuthenticationService: AuthenticationClient;

  constructor(
    @Inject(AUTHENTICATION_PACKAGE_NAME) private authClient: ClientGrpc,
  ) {}
  onModuleInit(): void {
    this.grpcAuthenticationService =
      this.authClient.getService<AuthenticationClient>(
        AUTHENTICATION_SERVICE_NAME,
      );
  }

  async register(data: RegisterRequest, metadata?: Metadata) {
    const response = this.grpcAuthenticationService.register(data);

    return await lastValueFrom(response);
  }

  async login(data: LoginRequest, metadata?: Metadata) {
    const response = this.grpcAuthenticationService.login(data);

    return await lastValueFrom(response);
  }
}
