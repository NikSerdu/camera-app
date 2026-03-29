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
import { CheckOtpUseCase } from '@/application/useCases/checkOtp.useCase'
import { IEmailService } from '@/domain/services/email.service'
import { EmailService } from '@/infrastructure/services/email.service'
import { RedisModule } from '@/infrastructure/redis/redis.module'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { PROTO_PATHS } from '@eyenest/contracts'
import { NotificationClientGrpc } from '@/infrastructure/grpc/clients/notification.grpc'

@Module({
	imports: [
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: getJwtConfig,
			inject: [ConfigService],
		}),
		ClientsModule.registerAsync([
			{
				name: 'NOTIFICATIONS_PACKAGE',
				useFactory: (configService: ConfigService) => ({
					transport: Transport.GRPC,
					options: {
						package: 'notifications.v1',
						protoPath: PROTO_PATHS.NOTIFICATIONS,
						url: configService.getOrThrow('NOTIFICATIONS_GRPC_URL'),
					},
				}),
				inject: [ConfigService],
			},
		]),
		RedisModule,
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
		{
			provide: IEmailService,
			useClass: EmailService,
		},
		RegisterUserUseCase,
		LoginUseCase,
		RefreshUseCase,
		CheckOtpUseCase,
		NotificationClientGrpc,
	],
})
export class AuthModule {}
