import { ICameraRepository, LocationEntity } from '@/domain';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LocationWithCameras } from '@/shared';
import { CreateLocationRequest } from '@eyenest/contracts/gen/ts/camera';

@Injectable()
export class CameraRepository implements ICameraRepository {
  constructor(private readonly prisma: PrismaService) {}
  async getLocationsByUserId(userId: string): Promise<LocationWithCameras[]> {
    return await this.prisma.location.findMany({
      where: {
        userId,
      },
      include: {
        cameras: {
          include: {
            cameraSettings: true,
          },
        },
      },
    });
  }
  async createLocation(data: CreateLocationRequest): Promise<LocationEntity> {
    const location = await this.prisma.location.create({
      data,
    });

    return {
      id: location.id,
      name: location.name,
      userId: location.userId,
      cameras: [],
    };
  }
}
