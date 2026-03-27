import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MESSAGES } from '../common/constants/messages';

@Injectable()
export class MonitoringService {
  private readonly logger = new Logger(MonitoringService.name);
  private readonly UPTIMEROBOT_API_URL = 'https://api.uptimerobot.com/v2/newMonitor';

  constructor(private readonly configService: ConfigService) {}

  async registerNewMonitor(url: string) {
    const apiKey = this.configService.get<string>('UPTIMEROBOT_API_KEY');

    if (!apiKey) {
      this.logger.warn('UPTIMEROBOT_API_KEY is not set. Skipping monitor registration.');
      return {
        success: false,
        message: 'No UptimeRobot API key found in configuration.',
      };
    }

    try {
      this.logger.log(`Attempting to register new monitor for URL: ${url}`);

      const response = await fetch(this.UPTIMEROBOT_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          api_key: apiKey,
          format: 'json',
          type: '1', // HTTP(s)
          url: url,
          friendly_name: `BitCore - ${new URL(url).hostname}`,
          interval: '300', // 5 minutes
        }).toString(),
      });

      let data: any;
      try {
        data = await response.json();
      } catch (err) {
        this.logger.error('Failed to parse UptimeRobot response as JSON');
        return {
          success: false,
          message: 'Received an invalid response from UptimeRobot.',
        };
      }

      if (data && data.stat === 'ok') {
        this.logger.log('Successfully registered monitor on UptimeRobot.');
        return {
          message: MESSAGES.MONITOR_REGISTERED,
          data: {
            monitorId: data.monitor?.id,
          },
        };
      } else {
        this.logger.error(`UptimeRobot API error: ${JSON.stringify(data?.error || data)}`);
        return {
          message: data?.error?.message || MESSAGES.MONITOR_REGISTRATION_FAILED,
          data: data?.error,
        };
      }
    } catch (error) {
      this.logger.error('Error calling UptimeRobot API:', error);
      return {
        success: false,
        message: 'An internal error occurred while registering the monitor.',
      };
    }
  }
}
