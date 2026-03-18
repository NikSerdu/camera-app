import type {
  StartRecordingRequest,
  StartRecordingResponse,
  StopRecordingRequest,
  StopRecordingResponse,
  GetAllRecordingsRequest,
  GetAllRecordingsResponse,
  GetPresignedUrlResponse,
  GetPresignedUrlRequest,
} from '@eyenest/contracts/gen/ts/video';
import { StartRecordingUseCase } from '@/application/useCases/egress/startRecording.useCase';
import { Controller } from '@nestjs/common';
import { EventPattern, GrpcMethod, Payload } from '@nestjs/microservices';
import { StopRecordingUseCase } from '@/application/useCases/egress/stopRecording.useCase';
import { GetAllRecordingUseCase } from '@/application/useCases/video/getAllRecordings.useCase';
import { GetPresignedUrlUseCase } from '@/application/useCases/video/getPresignedUrl.useCase';

@Controller('recordings')
export class RecordingsController {
  constructor(
    private readonly startRecordingUseCase: StartRecordingUseCase,
    private readonly stopRecordingUseCase: StopRecordingUseCase,
    private readonly getAllRecordingsUseCase: GetAllRecordingUseCase,
    private readonly getPresignedUrlUseCase: GetPresignedUrlUseCase,
  ) {}

  @EventPattern('camera.start-recording')
  async startRecording(
    @Payload() data: StartRecordingRequest,
  ): Promise<StartRecordingResponse> {
    console.log('старт');

    return await this.startRecordingUseCase.execute(data);
  }

  @EventPattern('camera.stop-recording')
  async stopRecording(
    @Payload() data: StopRecordingRequest,
  ): Promise<StopRecordingResponse> {
    return await this.stopRecordingUseCase.execute(data);
  }

  @GrpcMethod('VideoService', 'GetAllRecordings')
  async getAllRecordings(
    data: GetAllRecordingsRequest,
  ): Promise<GetAllRecordingsResponse> {
    return await this.getAllRecordingsUseCase.execute(data);
  }

  @GrpcMethod('VideoService', 'GetPresignedUrl')
  async getPresignedUrl(
    data: GetPresignedUrlRequest,
  ): Promise<GetPresignedUrlResponse> {
    return await this.getPresignedUrlUseCase.execute(data);
  }
}
