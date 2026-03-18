import type {
  StartRecordingRequest,
  StopRecordingResponse,
} from '@eyenest/contracts/gen/ts/video';
import { EgressInfo } from 'livekit-server-sdk';
export abstract class IVideoService {
  abstract startRecording(data: StartRecordingRequest): Promise<EgressInfo>;
  abstract stopRecording(egressId: string): Promise<StopRecordingResponse>;
}
