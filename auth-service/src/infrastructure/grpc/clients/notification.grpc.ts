import { Inject, Injectable } from '@nestjs/common'
import type { ClientGrpc } from '@nestjs/microservices'
import {
	NotificationsServiceClient,
	SendEmailRequest,
	SendEmailResponse,
} from '@eyenest/contracts/gen/ts/notifications'
import { firstValueFrom } from 'rxjs'

@Injectable()
export class NotificationClientGrpc {
	private notificationService: NotificationsServiceClient | null = null

	constructor(
		@Inject('NOTIFICATIONS_PACKAGE') private readonly client: ClientGrpc,
	) {}

	private get service(): NotificationsServiceClient {
		if (!this.notificationService) {
			this.notificationService =
				this.client.getService<NotificationsServiceClient>(
					'NotificationsService',
				)
		}

		return this.notificationService
	}

	async sendEmail(data: SendEmailRequest): Promise<SendEmailResponse> {
		return await firstValueFrom(this.service.sendEmail(data))
	}
}
