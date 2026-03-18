import { IsNotEmpty, IsString } from 'class-validator';

export class GetAllRecordingsQuery {
  @IsString()
  @IsNotEmpty()
  cameraId: string;
}
