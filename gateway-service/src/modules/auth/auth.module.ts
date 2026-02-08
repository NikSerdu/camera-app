import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { GrpcModule } from '@eyenest/common';
import { AuthClientGrpc } from './auth.grpc';

@Module({
  imports: [GrpcModule.register(['AUTH_PACKAGE'])],
  controllers: [AuthController],
  providers: [AuthClientGrpc],
})
export class AuthModule {}
