import { Controller } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'
import type {
	LoginRequest,
	LoginResponse,
	RefreshRequest,
	RefreshResponse,
	RegisterRequest,
	RegisterResponse,
	CheckOtpCodeRequest,
	CheckOtpCodeResponse,
} from '@eyenest/contracts/gen/ts/auth'
import { RegisterUserUseCase } from '@/application/useCases/register-user.useCase'
import { LoginUseCase } from '@/application/useCases/login.useCase'
import { RefreshUseCase } from '@/application/useCases/refresh.useCase'
import { CheckOtpUseCase } from '@/application/useCases/checkOtp.useCase'
@Controller('auth')
export class AuthController {
	constructor(
		private readonly registerUser: RegisterUserUseCase,
		private readonly loginUser: LoginUseCase,
		private readonly refreshUser: RefreshUseCase,
		private readonly checkOtpUser: CheckOtpUseCase,
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

	@GrpcMethod('AuthService', 'checkOtpCode')
	async checkOtp(data: CheckOtpCodeRequest): Promise<CheckOtpCodeResponse> {
		return await this.checkOtpUser.execute(data)
	}
}
