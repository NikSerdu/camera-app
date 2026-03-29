import { IEmailService } from '@/domain/services/email.service';
import { MailtrapClient } from 'mailtrap';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService implements IEmailService {
  private readonly client: MailtrapClient;
  private readonly sender = {
    email: 'hello@demomailtrap.co',
    name: 'Mailtrap Test',
  };
  private readonly recipients = [
    {
      email: 'nik.serdu201584@gmail.com',
    },
  ];
  constructor(private readonly configService: ConfigService) {
    this.client = new MailtrapClient({
      token: this.configService.getOrThrow('MAILTRAP_TOKEN'),
    });
  }

  async sendEmail(
    email: string,
    data: { subject: string; text?: string; html?: string },
  ): Promise<void> {
    console.log(this.sender, this.recipients, data);

    this.client
      .send({
        from: this.sender,
        to: this.recipients,
        subject: data.subject,
        text: data.text,
        html: data.html,
      })
      .then(console.log, console.error);
  }
}
