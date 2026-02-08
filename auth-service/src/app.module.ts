import { Module } from '@nestjs/common'
import { AuthModule } from './presentation/modules/auth/auth.module'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from './infrastructure/prisma/prisma.module'
import { UserModule } from './presentation/modules/user/user.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: [
				`.env.${process.env.NODE_ENV}.local`,
				`.env.${process.env.NODE_ENV}`,
				'.env',
			],
		}),
		AuthModule,
		UserModule,
		PrismaModule,
	],
})
export class AppModule {}
