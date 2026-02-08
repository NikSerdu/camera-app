import { Injectable } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { InjectGrpcClient } from '@eyenest/common';
import type { AuthServiceClient } from '@eyenest/contracts/gen/ts/auth';
import { AbstractGrpcClient } from '@/shared';

@Injectable()
export class AuthClientGrpc extends AbstractGrpcClient<AuthServiceClient> {
  constructor(@InjectGrpcClient('AUTH_PACKAGE') client: ClientGrpc) {
    super(client, 'AuthService');
  }
}
