import { IUserRepository } from '@/domain'
import { IAuthService } from '@/domain/services'
import { RegisterRequest } from '@eyenest/contracts/gen/ts/auth'
import { RpcException } from '@nestjs/microservices'
import { RpcStatus } from '@eyenest/common'
import { Injectable } from '@nestjs/common'
import { IEmailService } from '@/domain/services/email.service'

@Injectable()
export class RegisterUserUseCase {
	constructor(
		private readonly userRepository: IUserRepository,
		private readonly authService: IAuthService,
		private readonly emailService: IEmailService,
	) {}

	async execute(data: RegisterRequest) {
		const alreadyExists = await this.userRepository.getByEmail({
			email: data.email,
		})
		if (alreadyExists) {
			throw new RpcException({
				code: RpcStatus.ALREADY_EXISTS,
				details: 'Такой аккаунт уже существует!',
			})
		}
		const hashedPassword = await this.authService.hashPassword(data.password)

		const otpCode = await this.authService.generateOtpCode(
			JSON.stringify({ email: data.email, password: hashedPassword }),
		)
		await this.emailService.sendOtpCode(data.email, otpCode)
		return { success: true }
	}
}
