import { Controller } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'
import type {
	LoginRequest,
	LoginResponse,
	RefreshRequest,
	RefreshResponse,
	RegisterRequest,
	RegisterResponse,
} from '@eyenest/contracts/gen/ts/auth'
import { RegisterUserUseCase } from '@/application/useCases/register-user.useCase'
import { LoginUseCase } from '@/application/useCases/login.useCase'
import { RefreshUseCase } from '@/application/useCases/refresh.useCase'
@Controller('auth')
export class AuthController {
	constructor(
		private readonly registerUser: RegisterUserUseCase,
		private readonly loginUser: LoginUseCase,
		private readonly refreshUser: RefreshUseCase,
	) {}

	@GrpcMethod('AuthService', 'register')
	async register(data: RegisterRequest): Promise<RegisterResponse> {
		return await this.registerUser.execute(data)
	}

	@GrpcMethod('AuthService', 'login')
	async login(data: LoginRequest): Promise<LoginResponse> {
		return await this.loginUser.execute(data)
	}

	@GrpcMethod('AuthService', 'refresh')
	async refresh(data: RefreshRequest): Promise<RefreshResponse> {
		return await this.refreshUser.execute(data)
	}
}
