import { IUserRepository } from '@/domain'
import { IAuthService } from '@/domain/services/auth.service'
import {
	CheckOtpCodeRequest,
	CheckOtpCodeResponse,
} from '@eyenest/contracts/gen/ts/auth'
import { Injectable } from '@nestjs/common'

@Injectable()
export class CheckOtpUseCase {
	constructor(
		private readonly authService: IAuthService,
		private readonly userRepository: IUserRepository,
	) {}

	async execute(data: CheckOtpCodeRequest): Promise<CheckOtpCodeResponse> {
		console.log(data)
		const user = await this.authService.getUserByOtpCode(data.code)
		console.log(user)

		const parsedUser = JSON.parse(user)
		if (parsedUser.userId) {
			const tokens = await this.authService.generateTokens(parsedUser.userId)
			return tokens
		} else {
			const user = await this.userRepository.register({
				email: parsedUser.email,
				password: parsedUser.password,
			})
			const tokens = await this.authService.generateTokens(user.id)
			return tokens
		}
	}
}
