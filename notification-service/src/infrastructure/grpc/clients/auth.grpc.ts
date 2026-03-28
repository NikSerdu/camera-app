import { Inject, Injectable } from '@nestjs/common';
import { RpcException, type ClientGrpc } from '@nestjs/microservices';
import type {
  AuthServiceClient,
  GetUserByIdResponse,
  GetUserIdByTelegramChatIdResponse,
  GetUserNotificationSettingsResponse,
  UpdateUserNotificationSettingsRequest,
  UpdateUserNotificationSettingsResponse,
} from '@eyenest/contracts/gen/ts/auth';
import { firstValueFrom, type Observable } from 'rxjs';

@Injectable()
export class AuthClientGrpc {
  private authService: AuthServiceClient | null = null;

  constructor(@Inject('AUTH_PACKAGE') private readonly client: ClientGrpc) {}

  private get service(): AuthServiceClient {
    if (!this.authService) {
      this.authService =
        this.client.getService<AuthServiceClient>('AuthService');
    }

    return this.authService;
  }

  /** gRPC-клиент кидает обычный Error с полями code/details, а не Nest RpcException */
  private async fromGrpc<T>(call: Observable<T>): Promise<T> {
    try {
      return await firstValueFrom(call);
    } catch (e) {
      if (this.isGrpcStatusError(e)) {
        throw new RpcException({
          code: e.code,
          details: e.details ?? '',
        });
      }
      throw e;
    }
  }

  private isGrpcStatusError(e: unknown): e is { code: number; details?: string } {
    return (
      typeof e === 'object' &&
      e !== null &&
      'code' in e &&
      typeof (e as { code: unknown }).code === 'number'
    );
  }

  async getUserNotificationSettings(
    userId: string,
  ): Promise<GetUserNotificationSettingsResponse> {
    return this.fromGrpc(
      this.service.getUserNotificationSettings({ userId }),
    );
  }

  async getUserById(userId: string): Promise<GetUserByIdResponse> {
    return this.fromGrpc(this.service.getUserById({ userId }));
  }

  async updateUserNotificationSettings(
    data: UpdateUserNotificationSettingsRequest,
  ): Promise<UpdateUserNotificationSettingsResponse> {
    return this.fromGrpc(
      this.service.updateUserNotificationSettings(data),
    );
  }
  async getUserIdByTelegramChatId(
    telegramChatId: string,
  ): Promise<GetUserIdByTelegramChatIdResponse> {
    return this.fromGrpc(
      this.service.getUserIdByTelegramChatId({ telegramChatId }),
    );
  }
}
