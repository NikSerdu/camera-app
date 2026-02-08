export interface ITokens {
	accessToken: string
	refreshToken: string
}

export interface ITokenVerify {
	isValid: boolean
	userId: string | null
}
