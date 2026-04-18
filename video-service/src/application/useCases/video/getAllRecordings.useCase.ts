import type {
  GetAllRecordingsRequest,
  GetAllRecordingsResponse,
} from '@eyenest/contracts/gen/ts/video';
import { Injectable } from '@nestjs/common';
import { IVideoRepository } from '@/domain/repositories/video.repository';
import { VideoFileStatus as PrismaVideoFileStatus } from '@prisma/generated/enums';

@Injectable()
export class GetAllRecordingUseCase {
  constructor(private readonly videoRepository: IVideoRepository) {}

  async execute(
    data: GetAllRecordingsRequest,
  ): Promise<GetAllRecordingsResponse> {
    const recs = await this.videoRepository.getVideoFiles(data.roomId);
    const recording = recs.map((rec) => ({
      id: rec.id,
      playlistName: rec.playlistName,
      status: rec.status === PrismaVideoFileStatus.RECORDING ? 0 : 1,
      createdAt: rec.createdAt.toISOString(),
      updatedAt: rec.updatedAt.toISOString(),
      finishedAt: rec.finishedAt?.toISOString() ?? '',
    }));

    return { recording };
  }
}
