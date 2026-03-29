export abstract class IEmailService {
  abstract sendEmail(
    email: string,
    data: { subject: string; text?: string; html?: string },
  ): Promise<void>;
}
