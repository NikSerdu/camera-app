import { ApiProperty } from '@nestjs/swagger';

export class CheckOtpResponse {
  @ApiProperty()
  accessToken: string;
}
