import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import {
  ApiOperation,
  ApiOkResponse,
  ApiCookieAuth,
  ApiQuery,
} from '@nestjs/swagger';
import {
  GetLiveKitCameraTokenResponse,
  GetLiveKitViewerTokenResponse as GetLiveKitViewerTokenResponseDto,
} from './dto/responses/cameras.res';
import { Auth, CameraOwner, Current } from '@/shared';
import { GetLiveKitViewerTokenResponse } from '@eyenest/contracts/gen/ts/camera';
import { CameraClientGrpc } from '@/core/grpc-clients/camera.grpc';
import { WebhookService } from './services/webhook.service';

type RawBodyRequest = Request & {
  rawBody?: Buffer;
};

@Controller('live_kit')
export class LiveKitController {
  constructor(
    private readonly camera: CameraClientGrpc,
    private readonly webhookService: WebhookService,
  ) {}

  @ApiCookieAuth('accessToken')
  @ApiOperation({
    summary: 'Get live kit viewer token',
  })
  @ApiOkResponse({
    type: GetLiveKitViewerTokenResponseDto,
  })
  @ApiQuery({
    name: 'roomId',
    type: String,
    required: true,
  })
  @HttpCode(HttpStatus.OK)
  @CameraOwner()
  @Get('getLiveKitViewerToken')
  async getLiveKitViewerToken(
    @Current('user') userId: string,
    @Query('roomId') roomId: string,
  ): Promise<GetLiveKitViewerTokenResponse> {
    return await this.camera.call('getLiveKitViewerToken', {
      userId,
      roomId,
    });
  }

  @ApiCookieAuth('accessToken')
  @ApiOperation({
    summary: 'Get live kit viewer token',
  })
  @ApiOkResponse({
    type: GetLiveKitCameraTokenResponse,
  })
  @ApiQuery({
    name: 'roomId',
    type: String,
    required: true,
  })
  @HttpCode(HttpStatus.OK)
  @Auth('camera')
  @Get('getLiveKitCameraToken')
  async getLiveKitCameraToken(
    @Current('camera') cameraId: string,
    @Query('roomId') roomId: string,
  ): Promise<GetLiveKitCameraTokenResponse> {
    return await this.camera.call('getLiveKitCameraToken', {
      cameraId,
      roomId,
    });
  }

  @Post('webhook')
  async handleWebhook(@Req() req: RawBodyRequest) {
    console.log(req.body);
    return await this.webhookService.handleWebhook(req);
  }
}
