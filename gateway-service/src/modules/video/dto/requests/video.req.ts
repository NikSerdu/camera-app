import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetAllRecordingsQuery {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  cameraId: string;
}

export class DeleteRecordingRequest {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  recordingId: string;
}

export class GetPlaylistQuery {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  recordingId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  cameraId: string;
}

export class GetSegmentQuery {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  recordingId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  cameraId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  file: string;
}
