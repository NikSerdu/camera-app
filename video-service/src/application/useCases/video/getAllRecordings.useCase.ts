import type {
  GetAllRecordingsRequest,
  GetAllRecordingsResponse,
} from '@eyenest/contracts/gen/ts/video';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IVideoRepository } from '@/domain/repositories/video.repository';
import { VideoFileStatus as PrismaVideoFileStatus } from '@prisma/generated/enums';
import { EYENEST_STITCHED_RECORDING_ID } from './stitched-recording.constants';

@Injectable()
export class GetAllRecordingUseCase {
  constructor(
    private readonly videoRepository: IVideoRepository,
    private readonly configService: ConfigService,
  ) {}

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

    const finished = recording.filter((r) => r.status === 1);
    const gatewayPublic = this.configService
      .get<string>('GATEWAY_PUBLIC_URL')
      ?.trim()
      .replace(/\/$/, '');

    if (gatewayPublic && finished.length > 0) {
      const chronological = [...finished].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
      const first = chronological[0];
      const last = chronological[chronological.length - 1];
      const stitchedPlaylistUrl = `${gatewayPublic}/video/stitchedPlaylist?cameraId=${encodeURIComponent(data.roomId)}`;
      const now = new Date().toISOString();

      return {
        recording: [
          {
            id: EYENEST_STITCHED_RECORDING_ID,
            playlistName: stitchedPlaylistUrl,
            status: 1,
            createdAt: first.createdAt,
            updatedAt: now,
            finishedAt: last.finishedAt || last.updatedAt,
          },
          ...recording,
        ],
      };
    }

    return { recording };
  }
}
