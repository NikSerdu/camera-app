import { Module } from '@nestjs/common';
import { CameraController } from './camera.controller';
import { GrpcModule } from '@eyenest/common';
import { CameraClientGrpc } from '../../core/grpc-clients/camera.grpc';
import { CameraOwnerGuard } from '@/shared/guards/camera-owner.guard';

@Module({
  imports: [GrpcModule.register(['CAMERA_PACKAGE'])],
  controllers: [CameraController],
  providers: [CameraClientGrpc, CameraOwnerGuard],
})
export class CameraModule {}
