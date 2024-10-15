import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses';
import { Injectable, Logger } from '@nestjs/common';
import { serializeError } from 'serialize-error';

import { SendEmailParams } from './types/send-email.js';

import { awsConfig } from '../config/aws.js';

@Injectable()
export class MailingService {
  private readonly client: SESClient;

  private readonly logger = new Logger(MailingService.name);

  constructor() {
    this.client = new SESClient({
      region: awsConfig.region,
      credentials: {
        secretAccessKey: awsConfig.secretAccessKey,
        accessKeyId: awsConfig.accessKey,
      },
    });
  }

  /**
   * @description tries to send plain email to destination
   */
  async sendPlainEmail(params: SendEmailParams): Promise<void> {
    const { recipients, body, subject } = params;

    const message = new SendEmailCommand({
      Source: awsConfig.senderEmail,
      Message: {
        Body: { Text: { Data: body } },
        Subject: { Data: subject },
      },
      Destination: {
        ToAddresses: recipients,
      },
    });

    this.logger.debug('Send plain email params...', { params });

    await this.sendEmail(message);
  }

  /**
   * @description tries to send email with html body to destination
   */
  async sendHtmlEmail(params: SendEmailParams): Promise<void> {
    const { recipients, body, subject } = params;

    const message = new SendEmailCommand({
      Source: awsConfig.senderEmail,
      Message: {
        Body: { Html: { Data: body } },
        Subject: { Data: subject, Charset: 'UTF-8' },
      },
      Destination: {
        ToAddresses: recipients,
      },
    });

    this.logger.debug('Send html email params...', { params });

    await this.sendEmail(message);
  }

  /**
   * @description tries to send email to destination, fails silently
   */
  private async sendEmail(message: SendEmailCommand): Promise<void> {
    try {
      this.logger.debug('Sending email...');

      await this.client.send(message);

      this.logger.debug('Email has been sent successfully!');
    } catch (error) {
      this.logger.error('Error while sending email', serializeError(error));
    }
  }
}
