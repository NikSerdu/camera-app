import { IEgressRepository } from '@/domain';
import { IVideoRepository } from '@/domain/repositories/video.repository';
import { ICameraService, IVideoService } from '@/domain/services';
import type {
  StartRecordingRequest,
  StartRecordingResponse,
} from '@eyenest/contracts/gen/ts/video';
import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices/exceptions/rpc-exception';
import { RpcStatus } from '@eyenest/common';
import { VideoFileStatus } from '@prisma/generated/enums';
@Injectable()
export class StartRecordingUseCase {
  constructor(
    private readonly egressRepository: IEgressRepository,
    private readonly videoRepository: IVideoRepository,
    private readonly videoService: IVideoService,
    private readonly cameraService: ICameraService,
  ) {}

  async execute(data: StartRecordingRequest): Promise<StartRecordingResponse> {
    try {
      const isCameraOnline = await this.cameraService.checkCameraOnline(
        data.roomId,
      );
      if (!isCameraOnline) {
        console.log('Камера не в сети');
        throw new RpcException({
          code: RpcStatus.CANCELLED,
          details: 'Камера не в сети',
        });
      }
      const isAlreadyRecording = await this.egressRepository.getEgress(
        data.roomId,
      );
      if (isAlreadyRecording) {
        throw new RpcException({
          code: RpcStatus.ALREADY_EXISTS,
          details: 'Запись уже запущена',
        });
      }
      const egress = await this.videoService.startRecording(
        data,
        this.getDate(),
      );
      await this.videoRepository.addVideoFile({
        cameraId: data.roomId,
        playlistName: egress.segmentResults[0].playlistName,
        status: VideoFileStatus.RECORDING,
      });
      await this.egressRepository.addEgress({
        roomId: data.roomId,
        egressId: egress.egressId,
      });
      return {
        egressId: egress.egressId,
      };
    } catch (error) {
      console.log(error);
      throw new RpcException({
        code: RpcStatus.INTERNAL,
        details: 'Ошибка при запуске записи',
      });
    }
  }

  private getDate(): string {
    const now = new Date();

    const formatted =
      now.getFullYear() +
      '-' +
      String(now.getMonth() + 1).padStart(2, '0') +
      '-' +
      String(now.getDate()).padStart(2, '0') +
      'T' +
      String(now.getHours()).padStart(2, '0') +
      String(now.getMinutes()).padStart(2, '0') +
      String(now.getSeconds()).padStart(2, '0');
    return formatted;
  }
}
