import { ICameraRepository } from '@/domain';
import { CameraRepository } from '@/infrastructure/repositories/camera.repository';
import { Module } from '@nestjs/common';
import { VideoController } from './video.controller';
import { IVideoService } from '@/domain/services/video.service';
import { VideoService } from '@/infrastructure/services/video.service';
import { GetLiveKitViewerTokenUseCase } from '@/application/useCases/live-kit/getLiveKitViewerToken.useCase';
import { GetLiveKitCameraTokenUseCase } from '@/application/useCases/camera/getLiveKitCameraToken.useCase';
import { ICameraService } from '@/domain/services/camera.service';
import { CameraService } from '@/infrastructure/services/camera.service';
import { EventEmitterModule } from '@eyenest/common';

@Module({
  imports: [EventEmitterModule.register('RMQ_CLIENT')],
  controllers: [VideoController],
  providers: [
    {
      provide: ICameraRepository,
      useClass: CameraRepository,
    },
    {
      provide: IVideoService,
      useClass: VideoService,
    },
    {
      provide: ICameraService,
      useClass: CameraService,
    },
    {
      provide: ICameraRepository,
      useClass: CameraRepository,
    },
    GetLiveKitViewerTokenUseCase,
    GetLiveKitCameraTokenUseCase,
  ],
})
export class VideoModule {}
