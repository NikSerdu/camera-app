export abstract class IEmailService {
	abstract sendOtpCode(email: string, code: string): Promise<void>
}
