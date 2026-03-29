import { IAuthService } from '@/domain/services'
import { ITokens } from '@/shared'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import * as argon2 from 'argon2'
import { RedisService } from '../redis/redis.service'
import { RpcStatus } from '@eyenest/common'
import { RpcException } from '@nestjs/microservices'

@Injectable()
export class AuthService implements IAuthService {
	constructor(
		private readonly jwt: JwtService,
		private readonly config: ConfigService,
		private readonly redis: RedisService,
	) {}
	async generateTokens(userId: string): Promise<ITokens> {
		const accessToken = await this.jwt.signAsync({
			sub: userId,
		})
		const refreshToken = await this.jwt.signAsync(
			{
				sub: userId,
			},
			{
				expiresIn: this.config.getOrThrow('JWT_REFRESH_TOKEN_EXPIRES'),
			},
		)
		return {
			accessToken,
			refreshToken,
		}
	}
	async hashPassword(password: string): Promise<string> {
		return await argon2.hash(password)
	}
	async verifyPassword(
		hashedPassword: string,
		password: string,
	): Promise<boolean> {
		if (await argon2.verify(hashedPassword, password)) {
			return true
		} else {
			return false
		}
	}

	async verifyToken(refreshToken: string): Promise<any> {
		try {
			const data = await this.jwt.verifyAsync(refreshToken)
			return {
				isValid: true,
				userId: data.sub,
			}
		} catch (error) {
			return {
				isValid: false,
				userId: null,
			}
		}
	}
	async generateOtpCode(user: string): Promise<string> {
		const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
		await this.redis.set(`otp:${otpCode}`, user, 'EX', 60 * 5)
		return otpCode
	}
	async getUserByOtpCode(code: string): Promise<string> {
		const user = await this.redis.get(`otp:${code}`)
		console.log(user)

		if (!user) {
			throw new RpcException({
				code: RpcStatus.NOT_FOUND,
				details: 'Код не найден',
			})
		}
		await this.redis.del(`otp:${code}`)
		return user
	}
}
