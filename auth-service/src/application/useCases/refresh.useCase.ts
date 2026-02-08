import { IAuthService } from '@/domain/services'
import { RefreshRequest } from '@eyenest/contracts/gen/ts/auth'
import { RpcException } from '@nestjs/microservices'
import { RpcStatus } from '@eyenest/common'
import { Injectable } from '@nestjs/common'

@Injectable()
export class RefreshUseCase {
	constructor(private readonly authService: IAuthService) {}

	async execute(data: RefreshRequest) {
		const result = await this.authService.verifyToken(data.refreshToken)
		if (!result.isValid || !result.userId) {
			throw new RpcException({
				code: RpcStatus.UNAUTHENTICATED,
				details: 'Неверный токен!',
			})
		}

		return await this.authService.generateTokens(result.userId)
	}
}
