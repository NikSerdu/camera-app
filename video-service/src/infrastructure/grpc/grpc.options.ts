import type { GrpcOptions } from '@nestjs/microservices';
import { PROTO_PATHS } from '@eyenest/contracts';

export const grpcPackages = ['video.v1'];

export const grpcProtoPaths = [PROTO_PATHS.VIDEO];

export const grpcLoader: NonNullable<GrpcOptions['options']['loader']> = {
  keepCase: false,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};
