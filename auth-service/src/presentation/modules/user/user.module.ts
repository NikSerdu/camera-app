import { Module } from '@nestjs/common'
import { UserController } from './user.controller'
import { GetUserByIdUseCase } from '@/application/useCases/getUserById.useCase'
import { IUserRepository } from '@/domain'
import { UserRepository } from '@/infrastructure/repositories/user.repository'

@Module({
	controllers: [UserController],
	providers: [
		GetUserByIdUseCase,
		{
			provide: IUserRepository,
			useClass: UserRepository,
		},
	],
})
export class UserModule {}
