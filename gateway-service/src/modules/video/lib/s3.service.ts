import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Readable } from 'stream';
import {
  GetObjectCommand,
  ListObjectsV2Command,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3Service {
  private readonly s3Client: S3Client;
  private readonly bucket: string;
  private readonly presignedExpiresIn: number;

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      region: 'test',
      endpoint: this.configService.getOrThrow('MINIO_EXTERNAL_ENDPOINT'),
      credentials: {
        accessKeyId: this.configService.getOrThrow('MINIO_ACCESS_KEY'),
        secretAccessKey: this.configService.getOrThrow('MINIO_SECRET_KEY'),
      },
      forcePathStyle: true,
    });
    this.bucket = this.configService.getOrThrow('MINIO_BUCKET');
    this.presignedExpiresIn = Number(
      this.configService.getOrThrow('PRESIGNED_URL_EXPIRES_IN'),
    );
  }

  async getPresignedUrl(key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });
    return getSignedUrl(this.s3Client, command, {
      expiresIn: this.presignedExpiresIn,
    });
  }

  async listKeysByPrefix(prefix: string): Promise<string[]> {
    const keys: string[] = [];
    let continuationToken: string | undefined;
    do {
      const page = await this.s3Client.send(
        new ListObjectsV2Command({
          Bucket: this.bucket,
          Prefix: prefix,
          ContinuationToken: continuationToken,
        }),
      );
      for (const obj of page.Contents ?? []) {
        if (obj.Key && !obj.Key.endsWith('/')) {
          keys.push(obj.Key);
        }
      }
      continuationToken = page.IsTruncated
        ? page.NextContinuationToken
        : undefined;
    } while (continuationToken);
    return keys;
  }

  async getObjectBodyStream(key: string): Promise<Readable> {
    const out = await this.s3Client.send(
      new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );
    if (!out.Body) {
      throw new Error(`S3 object has no body: ${key}`);
    }
    return out.Body as Readable;
  }
}
