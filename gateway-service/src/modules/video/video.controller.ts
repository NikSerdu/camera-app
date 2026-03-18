import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { VideoClientGrpc } from './video.grpc';
import { ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { GetAllRecordingsResponse } from './dto/responses/cameras.res';
import { CameraOwner } from '@/shared';
import { GetAllRecordingsQuery } from './dto/requests/video.req';
@Controller('video')
export class VideoController {
  constructor(private readonly video: VideoClientGrpc) {}

  @Get('getAllRecordings')
  @CameraOwner()
  @HttpCode(HttpStatus.OK)
  @ApiQuery({ name: 'cameraId', type: String })
  @CameraOwner()
  @ApiOkResponse({ type: GetAllRecordingsResponse, isArray: true })
  async getAllRecordings(@Query() query: GetAllRecordingsQuery) {
    const res = await this.video.call('getAllRecordings', {
      roomId: query.cameraId,
    });
    return res.recording && res.recording.length ? res.recording : [];
  }
}
