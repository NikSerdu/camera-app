import { Injectable } from '@nestjs/common';
import { LocationEntity } from '../entities';
import { CreateLocationRequest } from '@eyenest/contracts/gen/ts/camera';

@Injectable()
export abstract class ICameraRepository {
  abstract getLocationsByUserId(userId: string): Promise<LocationEntity[]>;
  abstract createLocation(data: CreateLocationRequest): Promise<LocationEntity>;
}
