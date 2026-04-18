import { Module } from '@nestjs/common';
import { VideoController } from './video.controller';
import { GrpcModule } from '@eyenest/common';
import { VideoClientGrpc } from './video.grpc';
import { CameraOwnerGuard } from '@/shared/guards/camera-owner.guard';
import { CameraClientGrpc } from '@/core/grpc-clients/camera.grpc';
import { RecordingPlaybackService } from './lib/recording-playback.service';
import { S3Service } from './lib/s3.service';

@Module({
  imports: [
    GrpcModule.register(['VIDEO_PACKAGE']),
    GrpcModule.register(['CAMERA_PACKAGE']),
  ],
  controllers: [VideoController],
  providers: [
    VideoClientGrpc,
    CameraClientGrpc,
    CameraOwnerGuard,
    S3Service,
    RecordingPlaybackService,
  ],
})
export class VideoModule {}
