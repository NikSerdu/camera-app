import { Injectable, NotFoundException } from '@nestjs/common';
import archiver from 'archiver';
import type { Response } from 'express';
import { VideoClientGrpc } from '../video.grpc';
import { S3Service } from './s3.service';

/** Matches `VideoFileStatus` from recordings gRPC (0 = RECORDING, 1 = FINISHED). */
type RecordingRow = {
  id: string;
  playlistName: string;
  status: number;
};

@Injectable()
export class RecordingPlaybackService {
  constructor(
    private readonly video: VideoClientGrpc,
    private readonly s3: S3Service,
  ) {}

  async findRecording(
    cameraId: string,
    recordingId: string,
  ): Promise<RecordingRow> {
    const res = await this.video.call('getAllRecordings', { roomId: cameraId });
    const recording = res.recording?.find((r) => r.id === recordingId);
    if (!recording) {
      throw new NotFoundException('Запись не найдена');
    }
    return recording as RecordingRow;
  }

  /** Same rules as video-service `GetPresignedUrlUseCase` (live vs finished playlist). */
  playlistObjectKey(recording: RecordingRow): string {
    if (recording.status !== 0) {
      return recording.playlistName;
    }
    return recording.playlistName.replace('.m3u8', '.m3u8');
  }

  recordingFolderPrefix(recording: RecordingRow): string {
    return recording.playlistName.split('/').slice(0, -1).join('/');
  }

  async buildRewrittenPlaylist(
    cameraId: string,
    recordingId: string,
  ): Promise<string> {
    const recording = await this.findRecording(cameraId, recordingId);
    const playlistKey = this.playlistObjectKey(recording);
    const presignedPlaylistUrl = await this.s3.getPresignedUrl(playlistKey);
    const playlistResponse = await fetch(presignedPlaylistUrl);
    const playlistText = await playlistResponse.text();

    const baseSegmentUrl = `/video/segment?recordingId=${recordingId}&cameraId=${cameraId}&file=`;

    return playlistText
      .split('\n')
      .map((line) => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) return line;
        const filename = trimmed.split('/').pop() ?? trimmed;
        return baseSegmentUrl + encodeURIComponent(filename);
      })
      .join('\n');
  }

  async getSegmentPresignedUrl(
    cameraId: string,
    recordingId: string,
    file: string,
  ): Promise<string> {
    const recording = await this.findRecording(cameraId, recordingId);
    const folder = recording.playlistName.split('/').slice(0, -1).join('/');
    const segmentKey = `${folder}/${file}`;
    return this.s3.getPresignedUrl(segmentKey);
  }

  async streamRecordingZip(
    res: Response,
    cameraId: string,
    recordingId: string,
  ) {
    const recording = await this.findRecording(cameraId, recordingId);
    const folder = this.recordingFolderPrefix(recording);
    const prefix = folder ? `${folder}/` : '';
    const keys = await this.s3.listKeysByPrefix(prefix);
    if (!keys.length) {
      throw new NotFoundException('Файлы записи не найдены');
    }

    res
      .setHeader('Content-Type', 'application/zip')
      .setHeader(
        'Content-Disposition',
        `attachment; filename="recording-${recordingId}.zip"`,
      );

    const archive = archiver('zip', { zlib: { level: 6 } });
    archive.on('error', () => {
      if (!res.writableEnded) {
        res.destroy();
      }
    });
    archive.pipe(res);

    for (const key of keys) {
      const stream = await this.s3.getObjectBodyStream(key);
      const name = key.split('/').pop() ?? key;
      archive.append(stream, { name });
    }

    await archive.finalize();
  }
}
