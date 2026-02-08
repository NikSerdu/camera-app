import { GetLocationsByUserIdUseCase } from '@/application/useCases/getLocationsByUserId.useCase';
import type {
  CreateLocationRequest,
  GetLocationsByUserIdRequest,
} from '@eyenest/contracts/gen/ts/camera';
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { CreateLocationUseCase } from '@/application/useCases/createLocation.useCase';

@Controller('camera')
export class CameraController {
  constructor(
    private readonly getLocationsByUserId: GetLocationsByUserIdUseCase,
    private readonly createLocationUseCase: CreateLocationUseCase,
  ) {}

  @GrpcMethod('CameraService', 'GetLocationsByUserId')
  async getUserLocations(data: GetLocationsByUserIdRequest) {
    console.log(await this.getLocationsByUserId.execute(data));

    return await this.getLocationsByUserId.execute(data);
  }

  @GrpcMethod('CameraService', 'CreateLocation')
  async createLocation(data: CreateLocationRequest) {
    return await this.createLocationUseCase.execute(data);
  }
}
