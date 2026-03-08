import { Module, Global } from '@nestjs/common';
import { MailService } from './mail.service';

@Global()
@Module({
  providers: [
    {
      provide: 'IMailService',
      useClass: MailService,
    },
  ],
  exports: ['IMailService'],
})
export class MailModule {}
