import { VideoFileStatus } from '@prisma/generated/client';

export class VideoFileEntity {
  id: string;
  cameraId: string;
  playlistName: string;
  status: VideoFileStatus;
  createdAt: Date;
  updatedAt: Date;
  finishedAt: Date | null;
}
