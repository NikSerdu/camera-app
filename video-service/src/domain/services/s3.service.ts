export abstract class IS3Service {
  abstract getPresignedUrl(fileName: string): Promise<string>;
}
