import { ITokens, ITokenVerify } from '@/shared'

export abstract class IAuthService {
	abstract generateTokens(userId: string): Promise<ITokens>
	abstract verifyToken(refreshToken: string): Promise<ITokenVerify>
	abstract hashPassword(password: string): Promise<string>
	abstract verifyPassword(
		hashedPassword: string,
		password: string,
	): Promise<boolean>
}
