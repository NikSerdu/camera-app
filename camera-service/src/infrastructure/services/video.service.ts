import {
  GetLiveKitCameraTokenRequest,
  GetLiveKitCameraTokenResponse,
  GetLiveKitViewerTokenRequest,
  GetLiveKitViewerTokenResponse,
} from '@eyenest/contracts/gen/ts/camera';
import { TrackSource } from '@livekit/protocol';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { IVideoService } from '@/domain/services/video.service';
import { AccessToken } from 'livekit-server-sdk';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class VideoService implements IVideoService {
  constructor(
    private readonly config: ConfigService,
    private readonly redis: RedisService,
  ) {}
  async getLiveKitViewerToken(
    data: GetLiveKitViewerTokenRequest,
  ): Promise<GetLiveKitViewerTokenResponse> {
    const at = new AccessToken(
      this.config.getOrThrow('LIVEKIT_API_KEY'),
      this.config.getOrThrow('LIVEKIT_API_SECRET'),
      {
        identity: `viewer-${data.userId}-${randomUUID()}`,
        name: data.userId,
      },
    );
    at.addGrant({
      room: data.roomId,
      roomJoin: true,
      canSubscribe: true,
      canPublishSources: [TrackSource.MICROPHONE],
    });
    const token = await at.toJwt();
    return { token };
  }
  async getLiveKitCameraToken(
    data: GetLiveKitCameraTokenRequest,
  ): Promise<GetLiveKitCameraTokenResponse> {
    const at = new AccessToken(
      this.config.getOrThrow('LIVEKIT_API_KEY'),
      this.config.getOrThrow('LIVEKIT_API_SECRET'),
      {
        identity: data.cameraId,
      },
    );
    at.addGrant({
      room: data.roomId,
      roomJoin: true,
      canPublish: true,
    });
    const token = await at.toJwt();
    await this.redis.set(`online:camera:${data.cameraId}`, 'true');
    return { token };
  }

  async checkCameraOnline(cameraId: string): Promise<boolean> {
    const online = await this.redis.get(`online:camera:${cameraId}`);
    return online === 'true';
  }
}
