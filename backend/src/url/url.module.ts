import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Url, UrlSchema } from './schemas/url.schema';
import { UrlRepository } from './repositories/url.repository';
import { UrlService } from './url.service';
import { UrlController, RedirectController } from './url.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Url.name, schema: UrlSchema }])],
  controllers: [UrlController, RedirectController],
  providers: [
    UrlService,
    {
      provide: 'IUrlRepository',
      useClass: UrlRepository,
    },
  ],
})
export class UrlModule {}
