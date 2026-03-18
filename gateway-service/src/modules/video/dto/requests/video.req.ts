import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetPresignedUrlRequest {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  fileId: string;
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  cameraId: string;
}
