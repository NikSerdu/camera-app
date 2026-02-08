import { RegisterRequest } from '@eyenest/contracts/gen/ts/auth'
import { GetByEmailRequest } from '@eyenest/contracts/gen/ts/user'
import { User } from '@prisma/generated/client'
export abstract class IUserRepository {
	abstract register(data: RegisterRequest): Promise<User>
	abstract getByEmail(data: GetByEmailRequest): Promise<User | null>
	abstract getById(userId: string): Promise<User | null>
}
