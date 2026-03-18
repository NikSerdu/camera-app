import { IEgressRepository } from '@/domain';
import { EgressRepository } from '@/infrastructure/repositories/egress.repository';
import { Module } from '@nestjs/common';
import { RecordingsController } from './recordings.controller';
import { StartRecordingUseCase } from '@/application/useCases/egress/startRecording.useCase';
import { IVideoService } from '@/domain/services';
import { VideoService } from '@/infrastructure/services/video.service';
import { StopRecordingUseCase } from '@/application/useCases/egress/stopRecording.useCase';
import { IVideoRepository } from '@/domain/repositories/video.repository';
import { VideoRepository } from '@/infrastructure/repositories/video.repository';
import { GetAllRecordingUseCase } from '@/application/useCases/video/getAllRecordings.useCase';
import { GetPresignedUrlUseCase } from '@/application/useCases/video/getPresignedUrl.useCase';
import { S3Service } from '@/infrastructure/services/s3.service';
import { IS3Service } from '@/domain/services/s3.service';

@Module({
  imports: [],
  controllers: [RecordingsController],
  providers: [
    {
      provide: IEgressRepository,
      useClass: EgressRepository,
    },
    {
      provide: IVideoRepository,
      useClass: VideoRepository,
    },
    {
      provide: IVideoService,
      useClass: VideoService,
    },

    {
      provide: IS3Service,
      useClass: S3Service,
    },

    StartRecordingUseCase,
    StopRecordingUseCase,
    GetAllRecordingUseCase,
    GetPresignedUrlUseCase,
  ],
})
export class RecordingsModule {}
