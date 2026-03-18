import { Injectable } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { InjectGrpcClient } from '@eyenest/common';
import { AbstractGrpcClient } from '@/shared/grpc/abstract-grpc.client';
import type { VideoServiceClient } from '@eyenest/contracts/gen/ts/video';

@Injectable()
export class VideoClientGrpc extends AbstractGrpcClient<VideoServiceClient> {
  constructor(@InjectGrpcClient('VIDEO_PACKAGE') client: ClientGrpc) {
    super(client, 'VideoService');
  }
}
