import { ApiProperty } from '@nestjs/swagger';

export class GetLiveKitViewerTokenResponse {
  @ApiProperty()
  token: string;
}

export class GetLiveKitCameraTokenResponse {
  @ApiProperty()
  token: string;
}

export class StartHlsRecordingResponse {
  @ApiProperty()
  egressId: string;
}

export class StopHlsRecordingResponse {
  @ApiProperty()
  egressId: string;
}
