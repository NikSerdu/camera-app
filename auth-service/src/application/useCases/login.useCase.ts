import { IUserRepository } from '@/domain'
import { IAuthService } from '@/domain/services'
import { LoginRequest } from '@eyenest/contracts/gen/ts/auth'
import { RpcException } from '@nestjs/microservices'
import { RpcStatus } from '@eyenest/common'
import { Injectable } from '@nestjs/common'

@Injectable()
export class LoginUseCase {
	constructor(
		private readonly userRepository: IUserRepository,
		private readonly authService: IAuthService,
	) {}

	async execute(data: LoginRequest) {
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

		return await this.authService.generateTokens(user.id)
	}
}
