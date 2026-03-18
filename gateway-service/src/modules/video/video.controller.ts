import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { VideoClientGrpc } from './video.grpc';
import { ApiOkResponse } from '@nestjs/swagger';
import { GetPresignedUrlResponse } from './dto/responses/cameras.res';
import { GetPresignedUrlRequest } from './dto/requests/video.req';
import { CameraOwner } from '@/shared';
@Controller('video')
export class VideoController {
  constructor(private readonly video: VideoClientGrpc) {}

  @Post('getPresignedUrl')
  @CameraOwner()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: GetPresignedUrlResponse })
  async getPresignedUrl(@Body() body: GetPresignedUrlRequest) {
    return await this.video.call('getPresignedUrl', {
      fileId: body.fileId,
      cameraId: body.cameraId,
    });
  }
}
