import { ApiProperty } from '@nestjs/swagger';

export class GetPresignedUrlResponse {
  @ApiProperty()
  url: string;
}
