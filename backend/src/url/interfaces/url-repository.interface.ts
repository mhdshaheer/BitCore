import { Url } from '../schemas/url.schema';

export interface IUrlRepository {
  create(url: Partial<Url>): Promise<Url>;
  findByShortCode(shortCode: string): Promise<Url | null>;
  findByOriginalUrlAndUserId(originalUrl: string, userId: string): Promise<Url | null>;
  findByUserId(userId: string): Promise<Url[]>;
  incrementClicks(id: string): Promise<void>;
  delete(id: string): Promise<void>;
}
