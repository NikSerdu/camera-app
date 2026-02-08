import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { CameraClientGrpc } from './camera.grpc';
import { ApiOperation, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger';
import { LocationResponse } from './dto';
import { Auth, CurrentUser } from '@/shared';
import { CreateLocationRequest } from './dto/requests/cameras.req';

@Controller('camera')
export class CameraController {
  constructor(private readonly camera: CameraClientGrpc) {}
  @ApiOperation({
    summary: 'Get all user cameras grouped by location',
  })
  @ApiOkResponse({
    type: LocationResponse,
    isArray: true,
  })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Auth()
  @Get('locations')
  async getCameras(@CurrentUser() userId: string) {
    const res = await this.camera.call('getLocationsByUserId', {
      userId,
    });
    console.log(JSON.stringify(res, null, 2));
    return Array.isArray(res.locations) ? res.locations : res;
  }

  @ApiOperation({
    summary: 'Create location',
  })
  @ApiOkResponse({
    type: LocationResponse,
  })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Auth()
  @Post('locations')
  async createLocation(
    @CurrentUser() userId: string,
    @Body() body: CreateLocationRequest,
  ) {
    return await this.camera.call('createLocation', {
      userId,
      name: body.name,
    });
  }
}
