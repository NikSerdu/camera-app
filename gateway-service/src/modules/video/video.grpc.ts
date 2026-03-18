import { Injectable } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { InjectGrpcClient } from '@eyenest/common';
import type { VideoServiceClient } from '@eyenest/contracts/gen/ts/video';
import { AbstractGrpcClient } from '@/shared';

@Injectable()
export class VideoClientGrpc extends AbstractGrpcClient<VideoServiceClient> {
  constructor(@InjectGrpcClient('VIDEO_PACKAGE') client: ClientGrpc) {
    super(client, 'VideoService');
  }
}
