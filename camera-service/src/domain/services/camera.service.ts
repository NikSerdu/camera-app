import {
  AddCameraRequest,
  AddCameraResponse,
  LinkCameraResponse,
} from '@eyenest/contracts/gen/ts/camera';

export abstract class ICameraService {
  abstract getCameraTempToken(
    data: AddCameraRequest,
  ): Promise<AddCameraResponse>;
  abstract getCameraTokens(cameraId: string): Promise<LinkCameraResponse>;
  abstract findCameraByToken(
    token: string,
  ): Promise<Omit<AddCameraRequest, 'userId'>>;
}
