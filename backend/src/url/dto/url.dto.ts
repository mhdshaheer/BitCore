import { IsUrl, IsNotEmpty } from 'class-validator';

export class CreateUrlDto {
  @IsUrl({}, { message: 'Invalid URL format' })
  @IsNotEmpty({ message: 'Original URL is required' })
  originalUrl: string;
}
