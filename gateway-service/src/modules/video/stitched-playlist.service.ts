import {
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';

import { VideoClientGrpc } from './video.grpc';
import {
  mergeVodHlsPlaylistsWithChapters,
  type StitchedChapterMeta,
} from './lib/merge-vod-hls-playlists';
import { EYENEST_STITCHED_RECORDING_ID } from './stitched-playlist.constants';

/** video.v1.VideoFileStatus.FINISHED — без value-import из contracts (runtime require к gen/ts ломается). */
const VIDEO_FILE_FINISHED = 1;

type MergedCacheEntry = {
  expires: number;
  body: string;
  chapters: StitchedChapterMeta[];
};

@Injectable()
export class StitchedPlaylistService {
  private readonly cache = new Map<string, MergedCacheEntry>();
  private readonly ttlMs = 45_000;

  constructor(private readonly video: VideoClientGrpc) {}

  private async getMerged(cameraId: string): Promise<{
    body: string;
    chapters: StitchedChapterMeta[];
  }> {
    const now = Date.now();
    const cached = this.cache.get(cameraId);
    if (cached && cached.expires > now) {
      return { body: cached.body, chapters: cached.chapters };
    }

    const res = await this.video.call('getAllRecordings', { roomId: cameraId });
    const list = res.recording ?? [];

    const sources = list
      .filter(
        (r) =>
          r.id !== EYENEST_STITCHED_RECORDING_ID &&
          r.status === VIDEO_FILE_FINISHED,
      )
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );

    if (sources.length === 0) {
      throw new NotFoundException('Нет завершённых записей для склейки');
    }

    const playlists: {
      playlistUrl: string;
      body: string;
      recordingId: string;
    }[] = [];

    for (const r of sources) {
      try {
        const { url } = await this.video.call('getPresignedUrl', {
          fileId: r.id,
          cameraId,
        });
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const body = await response.text();
        playlists.push({ playlistUrl: url, body, recordingId: r.id });
      } catch {
        throw new ServiceUnavailableException(
          'Не удалось загрузить один из плейлистов для склейки',
        );
      }
    }

    try {
      const { body, chapters } = mergeVodHlsPlaylistsWithChapters(playlists);
      this.cache.set(cameraId, {
        expires: now + this.ttlMs,
        body,
        chapters,
      });
      return { body, chapters };
    } catch {
      throw new ServiceUnavailableException(
        'Не удалось собрать склеенный плейлист',
      );
    }
  }

  async buildStitchedM3U8(cameraId: string): Promise<string> {
    const { body } = await this.getMerged(cameraId);
    return body;
  }

  async getStitchedChapters(cameraId: string): Promise<StitchedChapterMeta[]> {
    const { chapters } = await this.getMerged(cameraId);
    return chapters;
  }
}
