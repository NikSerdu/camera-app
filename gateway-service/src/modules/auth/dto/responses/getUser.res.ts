import { ApiProperty } from '@nestjs/swagger';

export class GetUserResponse {
  @ApiProperty()
  id: string;
  @ApiProperty()
  email: string;
}
