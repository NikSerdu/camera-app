import { IEmailService } from '@/domain/services/email.service'
import { Injectable } from '@nestjs/common'
import { NotificationClientGrpc } from '../grpc/clients/notification.grpc'

@Injectable()
export class EmailService implements IEmailService {
	constructor(private readonly notificationService: NotificationClientGrpc) {}
	async sendOtpCode(email: string, code: string): Promise<void> {
		await this.notificationService.sendEmail({
			email,
			subject: 'Код для входа в систему',
			text: `Ваш код для входа в систему: ${code}`,
		})
	}
}
