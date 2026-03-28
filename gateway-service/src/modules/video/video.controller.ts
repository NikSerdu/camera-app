import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { VideoClientGrpc } from './video.grpc';
import { StitchedPlaylistService } from './stitched-playlist.service';
import { ApiOkResponse, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { RecordingResponse } from './dto/responses/cameras.res';
import { CameraOwner, Current } from '@/shared';
import {
  DeleteRecordingRequest,
  GetAllRecordingsQuery,
} from './dto/requests/video.req';
@Controller('video')
export class VideoController {
  constructor(
    private readonly video: VideoClientGrpc,
    private readonly stitchedPlaylistService: StitchedPlaylistService,
  ) {}

  @ApiOperation({
    summary: 'Get all recordings',
  })
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

  @ApiOperation({
    summary: 'Склеенный HLS media playlist по всем завершённым записям камеры',
  })
  @Get('stitchedPlaylist')
  @CameraOwner()
  @HttpCode(HttpStatus.OK)
  @ApiQuery({ name: 'cameraId', type: String })
  async stitchedPlaylist(
    @Query('cameraId') cameraId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!cameraId?.trim()) {
      throw new BadRequestException('cameraId обязателен');
    }
    const body = await this.stitchedPlaylistService.buildStitchedM3U8(cameraId);
    res.setHeader('Content-Type', 'application/vnd.apple.mpegurl; charset=utf-8');
    res.setHeader('Cache-Control', 'no-store');
    return body;
  }

  @ApiOperation({
    summary: 'Таймкоды записей внутри склеенного HLS (startSec относительно одного потока)',
  })
  @Get('stitchedChapters')
  @CameraOwner()
  @HttpCode(HttpStatus.OK)
  @ApiQuery({ name: 'cameraId', type: String })
  async stitchedChapters(@Query('cameraId') cameraId: string) {
    if (!cameraId?.trim()) {
      throw new BadRequestException('cameraId обязателен');
    }
    const chapters = await this.stitchedPlaylistService.getStitchedChapters(
      cameraId,
    );
    return { chapters };
  }

  @ApiOperation({
    summary: 'Delete recording',
  })
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
}
