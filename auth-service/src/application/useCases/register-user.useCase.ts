import { IUserRepository } from '@/domain'
import { IAuthService } from '@/domain/services'
import { RegisterRequest } from '@eyenest/contracts/gen/ts/auth'
import { RpcException } from '@nestjs/microservices'
import { RpcStatus } from '@eyenest/common'
import { Injectable } from '@nestjs/common'

@Injectable()
export class RegisterUserUseCase {
	constructor(
		private readonly userRepository: IUserRepository,
		private readonly authService: IAuthService,
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
		const user = await this.userRepository.register({
			...data,
			password: hashedPassword,
		})
		if (user) {
			return await this.authService.generateTokens(user.id)
		}
		throw new RpcException({
			code: RpcStatus.UNKNOWN,
			details: 'Что-то пошло не так...',
		})
	}
}
