import { Module } from '@nestjs/common';
import { VideoController } from './video.controller';
import { GrpcModule } from '@eyenest/common';
import { VideoClientGrpc } from './video.grpc';
import { CameraOwnerGuard } from '@/shared/guards/camera-owner.guard';
import { CameraClientGrpc } from '@/core/grpc-clients/camera.grpc';

@Module({
  imports: [
    GrpcModule.register(['VIDEO_PACKAGE']),
    GrpcModule.register(['CAMERA_PACKAGE']),
  ],
  controllers: [VideoController],
  providers: [VideoClientGrpc, CameraClientGrpc, CameraOwnerGuard],
})
export class VideoModule {}
