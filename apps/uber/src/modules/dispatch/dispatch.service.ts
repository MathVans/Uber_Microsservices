import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class DispatchService {
  constructor(
    @Inject('DISPATCH_SERVICE') private readonly dispatchClient: ClientProxy,
  ) {}

  checkHealthy() {}
}
