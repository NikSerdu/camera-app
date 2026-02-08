import { IUserRepository } from '@/domain'
import { GetByEmailRequest } from '@eyenest/contracts/gen/ts/user'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { RegisterRequest } from '@eyenest/contracts/gen/ts/auth'
import { User } from '@prisma/generated/client'

@Injectable()
export class UserRepository implements IUserRepository {
	constructor(private readonly prisma: PrismaService) {}
	async getByEmail(data: GetByEmailRequest): Promise<User | null> {
		return await this.prisma.user.findUnique({
			where: {
				email: data.email,
			},
		})
	}

	async register(data: RegisterRequest): Promise<User> {
		return await this.prisma.user.create({ data })
	}

	async getById(userId: string): Promise<User | null> {
		return await this.prisma.user.findUnique({
			where: {
				id: userId,
			},
		})
	}
}
