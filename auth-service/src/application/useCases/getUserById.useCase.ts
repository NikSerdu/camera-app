import { IUserRepository } from '@/domain'
import { RpcStatus } from '@eyenest/common'
import {
	GetUserByIdRequest,
	GetUserByIdResponse,
} from '@eyenest/contracts/gen/ts/auth'
import { Injectable } from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'

@Injectable()
export class GetUserByIdUseCase {
	constructor(private readonly userRepository: IUserRepository) {}

	async execute(data: GetUserByIdRequest): Promise<GetUserByIdResponse> {
		const user = await this.userRepository.getById(data.userId)
		if (!user)
			throw new RpcException({
				code: RpcStatus.NOT_FOUND,
				details: 'Пользователь не найден!',
			})
		const { createdAt, updatedAt, ...rest } = user
		return rest
	}
}
