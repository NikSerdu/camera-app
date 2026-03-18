import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TrackType, WebhookEvent, WebhookReceiver } from 'livekit-server-sdk';
import { Request } from 'express';
import { ClientProxy } from '@nestjs/microservices';

type RawBodyRequest = Request & {
  rawBody?: Buffer | string;
};

@Injectable()
export class WebhookService {
  private readonly receiver: WebhookReceiver;

  constructor(
    private readonly configService: ConfigService,
    @Inject('RMQ_CLIENT') private readonly rmqClient: ClientProxy,
  ) {
    this.receiver = new WebhookReceiver(
      this.configService.getOrThrow<string>('LIVEKIT_WEBHOOK_KEY'),
      this.configService.getOrThrow<string>('LIVEKIT_API_SECRET'),
    );
  }

  async handleWebhook(req: RawBodyRequest) {
    const event: WebhookEvent = await this.receiver.receive(
      req.body,
      req.get('Authorization'),
    );
    const eventType = event.event;

    if (
      event.participant?.identity === event.room?.name &&
      event.track?.type === TrackType.VIDEO
    ) {
      if (eventType === 'track_published') {
        this.rmqClient.emit('camera.start-recording', {
          roomId: event.room?.name,
        });
      } else if (eventType === 'track_unpublished') {
        this.rmqClient.emit('camera.stop-recording', {
          roomId: event.room?.name,
        });
      }
    }
    return event;
  }
}
