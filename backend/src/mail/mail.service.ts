import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { IMailService } from './interfaces/mail-service.interface';

@Injectable()
export class MailService implements IMailService, OnModuleInit {
  private resend: Resend;
  private readonly logger = new Logger(MailService.name);

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    if (!apiKey || apiKey === 're_your_api_key_here') {
      this.logger.warn('RESEND_API_KEY is not set or using default. Email delivery will likely fail.');
    }
    this.resend = new Resend(apiKey);
    this.logger.log('MailService initialized with Resend SDK');
  }

  async sendMail(to: string, subject: string, html: string): Promise<void> {
    try {
      let from =
        this.configService.get<string>('MAIL_FROM') ||
        'BitCore <noreply@zenfit.space>';
      
      // Clean up accidental outer quotes if they exist
      from = from.replace(/^["'](.+)["']$/, '$1');

      this.logger.log(`Attempting to send email to ${to} from ${from} with subject: ${subject}`);
        
      const result = await this.resend.emails.send({
        from,
        to,
        subject,
        html,
      });

      if (result.error) {
        this.logger.error(`Resend API Error: ${result.error.message}`, result.error);
        throw new Error(`Resend Error: ${result.error.message}`);
      }

      this.logger.log(`Email sent successfully via Resend: ${result.data?.id}`);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      const stack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`Failed to send email to ${to}: ${message}`, stack);
      throw error;
    }
  }
}
