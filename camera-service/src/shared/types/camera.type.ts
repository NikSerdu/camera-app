import { Prisma } from '@prisma/generated/client';

export type LocationWithCameras = Prisma.LocationGetPayload<{
  include: {
    cameras: {
      include: {
        cameraSettings: true;
      };
    };
  };
}>;
