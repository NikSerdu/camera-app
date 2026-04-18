import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  Res,
} from '@nestjs/common';
import { VideoClientGrpc } from './video.grpc';
import { ApiOkResponse, ApiOperation, ApiQuery } from '@nestjs/swagger';
import {
  PresignedUrlResponse,
  RecordingResponse,
} from './dto/responses/cameras.res';
import { CameraOwner, Current } from '@/shared';
import {
  DeleteRecordingRequest,
  GetAllRecordingsQuery,
  GetPlaylistQuery,
  GetSegmentQuery,
} from './dto/requests/video.req';
import type { Response } from 'express';
import { RecordingPlaybackService } from './lib/recording-playback.service';

@Controller('video')
export class VideoController {
  constructor(
    private readonly video: VideoClientGrpc,
    private readonly playback: RecordingPlaybackService,
  ) {}

  @ApiOperation({ summary: 'Get all recordings' })
  @Get('getAllRecordings')
  @CameraOwner()
  @HttpCode(HttpStatus.OK)
  @ApiQuery({ name: 'cameraId', type: String })
  @ApiOkResponse({ type: RecordingResponse, isArray: true })
  async getAllRecordings(@Query() query: GetAllRecordingsQuery) {
    const res = await this.video.call('getAllRecordings', {
      roomId: query.cameraId,
    });
    return res.recording && res.recording.length ? res.recording : [];
  }

  @ApiOperation({ summary: 'Delete recording' })
  @ApiOkResponse({ type: RecordingResponse })
  @HttpCode(HttpStatus.OK)
  @CameraOwner()
  @Delete('deleteRecording')
  async deleteRecording(
    @Body() body: DeleteRecordingRequest,
    @Current('user') userId: string,
  ) {
    const res = await this.video.call('deleteRecording', {
      recordingId: body.recordingId,
      userId,
    });
    return res.recording ? res.recording : null;
  }

  @ApiOperation({
    summary:
      'Get HLS playlist proxied through gateway with rewritten segment URLs',
  })
  @Get('playlist')
  @CameraOwner()
  async getPlaylist(@Query() query: GetPlaylistQuery, @Res() res: Response) {
    const rewritten = await this.playback.buildRewrittenPlaylist(
      query.cameraId,
      query.recordingId,
    );
    res
      .set('Content-Type', 'application/vnd.apple.mpegurl')
      .set('Cache-Control', 'no-cache, no-store')
      .send(rewritten);
  }

  @ApiOperation({
    summary:
      'Return presigned MinIO URL for a segment (JSON; avoids XHR redirect + CORS with credentials)',
  })
  @ApiOkResponse({ type: PresignedUrlResponse })
  @Get('segment')
  @CameraOwner()
  @HttpCode(HttpStatus.OK)
  async getSegment(@Query() query: GetSegmentQuery) {
    const url = await this.playback.getSegmentPresignedUrl(
      query.cameraId,
      query.recordingId,
      query.file,
    );
    return { url };
  }

  @ApiOperation({
    summary:
      'Download recording as a ZIP (HLS playlist and segment files from the recording folder)',
  })
  @Get('download')
  @CameraOwner()
  async downloadRecording(
    @Query() query: GetPlaylistQuery,
    @Res() res: Response,
  ) {
    await this.playback.streamRecordingZip(
      res,
      query.cameraId,
      query.recordingId,
    );
  }
}
