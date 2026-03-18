import { Module } from '@nestjs/common';
import { LiveKitController } from './live_kit.controller';
import { GrpcModule } from '@eyenest/common';
import { CameraClientGrpc } from '@/core/grpc-clients/camera.grpc';
import { WebhookService } from './services/webhook.service';
import { CameraOwnerGuard } from '@/shared/guards/camera-owner.guard';

@Module({
  imports: [GrpcModule.register(['CAMERA_PACKAGE'])],
  controllers: [LiveKitController],
  providers: [WebhookService, CameraClientGrpc, CameraOwnerGuard],
})
export class LiveKitModule {}
