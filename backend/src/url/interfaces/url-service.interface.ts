import { CreateUrlDto } from '../dto/url.dto';

export interface IUrlService {
  createUrl(createUrlDto: CreateUrlDto, userId: string): Promise<{ message: string; data: any }>;
  getMyUrls(userId: string): Promise<{ message: string; data: any[] }>;
  resolveUrl(shortCode: string): Promise<{ message: string; data: any }>;
  deleteUrl(id: string, userId: string): Promise<{ message: string }>;
}
