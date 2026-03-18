import { Injectable } from '@nestjs/common';
import { EgressEntity } from '../entities';

@Injectable()
export abstract class IEgressRepository {
  abstract addEgress(data: Omit<EgressEntity, 'id'>): Promise<EgressEntity>;
  abstract getEgress(roomId: string): Promise<EgressEntity | null>;
  abstract deleteEgress(roomId: string): Promise<EgressEntity>;
}
