import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateLocationRequest {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;
}
