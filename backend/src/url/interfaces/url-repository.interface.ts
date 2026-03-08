import { IUrl } from './url.interface';

/**
 * Abstracts all persistence operations for the URL domain.
 * High-level modules (services) depend on this interface,
 * not on any concrete database implementation.
 */
export interface IUrlRepository {
  create(url: Partial<IUrl>): Promise<IUrl>;
  findByShortCode(shortCode: string): Promise<IUrl | null>;
  findByOriginalUrlAndUserId(
    originalUrl: string,
    userId: string,
  ): Promise<IUrl | null>;
  findByUserId(userId: string): Promise<IUrl[]>;
  incrementClicks(id: string): Promise<void>;
  delete(id: string): Promise<void>;
}
