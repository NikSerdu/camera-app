import { UseGuards, applyDecorators } from '@nestjs/common';
import { Auth } from './auth.decorator';
import { CameraOwnerGuard } from '../guards/camera-owner.guard';

export const CameraOwner = () =>
  applyDecorators(Auth('user'), UseGuards(CameraOwnerGuard));
