import { IEmailService } from '@/domain/services/email.service';
import { Injectable } from '@nestjs/common';
import { SendEmailRequest } from '@eyenest/contracts/gen/ts/notifications';

@Injectable()
export class SendEmailUseCase {
  constructor(private readonly emailService: IEmailService) {}

  async execute(data: SendEmailRequest) {
    const { email, ...rest } = data;
    try {
      await this.emailService.sendEmail(email, {
        ...rest,
      });
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  }
}
