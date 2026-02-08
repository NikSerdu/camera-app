import { Controller } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'
import type {
	GetUserByIdRequest,
	GetUserByIdResponse,
} from '@eyenest/contracts/gen/ts/auth'
import { GetUserByIdUseCase } from '@/application/useCases/getUserById.useCase'
@Controller('user')
export class UserController {
	constructor(private readonly getUserById: GetUserByIdUseCase) {}

	@GrpcMethod('AuthService', 'getUserById')
	async getById(data: GetUserByIdRequest): Promise<GetUserByIdResponse> {
		return await this.getUserById.execute(data)
	}
}
