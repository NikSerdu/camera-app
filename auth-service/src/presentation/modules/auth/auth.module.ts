import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { getJwtConfig } from '@/shared'
import { IUserRepository } from '@/domain'
import { UserRepository } from '@/infrastructure/repositories/user.repository'
import { IAuthService } from '@/domain/services'
import { AuthService } from '@/infrastructure/services/auth.service'
import { RegisterUserUseCase } from '@/application/useCases/register-user.useCase'
import { LoginUseCase } from '@/application/useCases/login.useCase'
import { RefreshUseCase } from '@/application/useCases/refresh.useCase'

@Module({
	imports: [
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: getJwtConfig,
			inject: [ConfigService],
		}),
	],
	controllers: [AuthController],
	providers: [
		{
			provide: IUserRepository,
			useClass: UserRepository,
		},
		{
			provide: IAuthService,
			useClass: AuthService,
		},
		RegisterUserUseCase,
		LoginUseCase,
		RefreshUseCase,
	],
})
export class AuthModule {}
