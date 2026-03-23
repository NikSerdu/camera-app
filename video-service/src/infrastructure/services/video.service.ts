import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { IVideoService } from '@/domain/services/egress.service';
import {
  EgressClient,
  EgressInfo,
  EncodingOptions,
  RoomCompositeOptions,
  SegmentedFileOutput,
} from 'livekit-server-sdk';
import {
  StartRecordingRequest,
  StopRecordingResponse,
} from '@eyenest/contracts/gen/ts/video';

@Injectable()
export class VideoService implements IVideoService {
  private readonly egressClient: EgressClient;
  private readonly livekitUrl: string;
  private readonly apiKey: string;
  private readonly apiSecret: string;
  private readonly egressTemplateUrl?: string;
  constructor(private readonly configService: ConfigService) {
    this.livekitUrl = this.configService.getOrThrow('LIVEKIT_URL');
    this.apiKey = this.configService.getOrThrow('LIVEKIT_API_KEY');
    this.apiSecret = this.configService.getOrThrow('LIVEKIT_API_SECRET');
    this.egressTemplateUrl = this.configService.get<string>(
      'EGRESS_TEMPLATE_URL',
    );
    this.egressClient = new EgressClient(
      this.livekitUrl,
      this.apiKey,
      this.apiSecret,
    );
  }
  async startRecording(
    data: StartRecordingRequest,
    date: string,
  ): Promise<EgressInfo> {
    const outputs = {
      segments: new SegmentedFileOutput({
        filenamePrefix: `{room_name}/${date}/`,
        playlistName: 'playlist.m3u8',
        livePlaylistName: 'playlist-live.m3u8',
        segmentDuration: 5,
        output: {
          case: 's3',
          value: {
            accessKey: this.configService.getOrThrow('MINIO_ACCESS_KEY'),
            secret: this.configService.getOrThrow('MINIO_SECRET_KEY'),
            bucket: this.configService.getOrThrow('MINIO_BUCKET'),
            forcePathStyle: true,
            endpoint: this.configService.getOrThrow('MINIO_ENDPOINT'),
          },
        },
      }),
    };
    const options: RoomCompositeOptions = {
      layout: 'speaker',
      customBaseUrl: this.configService.getOrThrow('EGRESS_TEMPLATE_URL'),
      encodingOptions: new EncodingOptions({
        width: 640,
        height: 360,
        framerate: 10,
        videoBitrate: 800,
        audioBitrate: 64,
        keyFrameInterval: 4,
      }),
      audioOnly: false,
    };
    const egress = await this.egressClient.startRoomCompositeEgress(
      data.roomId,
      outputs,
      options,
    );
    return egress;
  }

  async stopRecording(egressId: string): Promise<StopRecordingResponse> {
    const egress = await this.egressClient.stopEgress(egressId);
    return {
      egressId: egress.egressId,
    };
  }
}
