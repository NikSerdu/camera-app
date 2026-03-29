import { IUserRepository } from '@/domain'
import { IAuthService } from '@/domain/services/auth.service'
import { IEmailService } from '@/domain/services/email.service'
import { LoginRequest, LoginResponse } from '@eyenest/contracts/gen/ts/auth'
import { RpcException } from '@nestjs/microservices'
import { RpcStatus } from '@eyenest/common'
import { Injectable } from '@nestjs/common'

@Injectable()
export class LoginUseCase {
	constructor(
		private readonly userRepository: IUserRepository,
		private readonly authService: IAuthService,
		private readonly emailService: IEmailService,
	) {}

	async execute(data: LoginRequest): Promise<LoginResponse> {
		const user = await this.userRepository.getByEmail({ email: data.email })
		if (!user) {
			throw new RpcException({
				code: RpcStatus.UNAUTHENTICATED,
				details: 'Неверный email или пароль!',
			})
		}
		const isValidPassword = await this.authService.verifyPassword(
			user.password,
			data.password,
		)
		if (!isValidPassword) {
			throw new RpcException({
				code: RpcStatus.UNAUTHENTICATED,
				details: 'Неверный email или пароль!',
			})
		}

		const otpCode = await this.authService.generateOtpCode(
			JSON.stringify({ userId: user.id }),
		)
		await this.emailService.sendOtpCode(user.email, otpCode)

		return {
			success: true,
		}
	}
}
