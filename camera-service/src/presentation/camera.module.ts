import { GetLocationsByUserIdUseCase } from '@/application/useCases/getLocationsByUserId.useCase';
import { ICameraRepository } from '@/domain';
import { CameraRepository } from '@/infrastructure/repositories/camera.repository';
import { Module } from '@nestjs/common';
import { AuthClientGrpc } from './auth.grpc';
import { CameraController } from './camera.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { PROTO_PATHS } from '@eyenest/contracts';
import { CreateLocationUseCase } from '@/application/useCases/createLocation.useCase';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'AUTH_PACKAGE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'auth.v1',
            protoPath: PROTO_PATHS.AUTH,
            url: configService.getOrThrow('AUTH_GRPC_URL'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [CameraController],
  providers: [
    {
      provide: ICameraRepository,
      useClass: CameraRepository,
    },
    AuthClientGrpc,
    GetLocationsByUserIdUseCase,
    CreateLocationUseCase,
  ],
})
export class CameraModule {}
