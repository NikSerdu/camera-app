import { ApiProperty } from '@nestjs/swagger';

export class CameraSettingsDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ enum: ['ON', 'OFF'] })
  aiStatus: string;
}

export class CameraDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ type: CameraSettingsDto, nullable: true })
  cameraSettings: CameraSettingsDto | null;
}

export class LocationResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  userId: string;

  @ApiProperty({ type: [CameraDto] })
  cameras: CameraDto[];
}
