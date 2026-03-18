import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { createGrpcServer } from './infrastructure/grpc/grpc.server';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);

  createGrpcServer(app, config);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [config.getOrThrow<string>('RMQ_URL')],
      queue: 'events_queue',
      queueOptions: { durable: true },
    },
  });
  await app.startAllMicroservices();
}
bootstrap();
