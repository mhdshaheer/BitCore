import { CreateUrlDto } from '../dto/url.dto';
import { IUrl } from './url.interface';

/**
 * Contract for the URL shortening service.
 * Controllers depend on this abstraction, not on any concrete class.
 */
export interface IUrlService {
  createUrl(createUrlDto: CreateUrlDto, userId: string): Promise<{ message: string; data: IUrl }>;
  getMyUrls(userId: string): Promise<{ message: string; data: IUrl[] }>;
  resolveUrl(shortCode: string): Promise<{ message: string; data: IUrl }>;
  deleteUrl(id: string, userId: string): Promise<{ message: string }>;
}
