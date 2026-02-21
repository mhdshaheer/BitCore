import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(MailService.name);

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: this.configService.get<string>('EMAIL_SERVICE') || 'gmail',
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASS'),
      },
    });
  }

  async sendMail(to: string, subject: string, html: string): Promise<void> {
    try {
      const from =
        this.configService.get<string>('MAIL_FROM') ||
        '"BitCore" <noreply@bitcore.com>';
      const info = (await this.transporter.sendMail({
        from,
        to,
        subject,
        html,
      })) as { messageId: string };

      this.logger.log(
        `Email sent via ${this.configService.get('EMAIL_SERVICE') || 'gmail'}: ${info.messageId}`,
      );
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Error sending email: ${message}`);
      throw error;
    }
  }
}
