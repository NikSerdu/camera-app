import { IEmailService } from '@/domain/services/email.service';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService implements IEmailService {
  public constructor(
    private readonly transporter: MailerService,
    private readonly configService: ConfigService,
  ) {}

  public async sendEmail(
    email: string,
    data: { subject: string; text?: string; html?: string },
  ) {
    await this.transporter.sendMail({
      from: this.configService.getOrThrow('MAIL_FROM'),
      to: email,
      subject: data.subject,
      text: data.text,
      html: data.html,
    });
  }
}
