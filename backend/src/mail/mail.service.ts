import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { IMailService } from './interfaces/mail-service.interface';

@Injectable()
export class MailService implements IMailService {
  private resend: Resend;
  private readonly logger = new Logger(MailService.name);

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    this.resend = new Resend(apiKey);
  }

  async sendMail(to: string, subject: string, html: string): Promise<void> {
    try {
      const from =
        this.configService.get<string>('MAIL_FROM') ||
        '"BitCore" <noreply@bitcore.zenfit.space>';
        
      const { data, error } = await this.resend.emails.send({
        from,
        to,
        subject,
        html,
      });

      if (error) {
        throw new Error(error.message);
      }

      this.logger.log(`Email sent via Resend: ${data?.id}`);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Error sending email: ${message}`);
      throw error;
    }
  }
}
