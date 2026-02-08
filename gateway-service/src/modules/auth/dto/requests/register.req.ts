import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegisterRequest {
  @ApiProperty({
    example: 'test@test.ru',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '12345',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
