import { Injectable, Logger } from '@nestjs/common';
// eslint-disable-next-line import/no-extraneous-dependencies -- import lib
import admin from 'firebase-admin';

import { SendNotificationParams } from './types/send-notification.js';

import { serializeError } from '../common/utils/serialize-error.js';
import { firebaseConfig } from '../config/firebase.js';

@Injectable()
export class PushNotificationService {
  private readonly messaging: admin.messaging.Messaging;

  private logger = new Logger(PushNotificationService.name);

  constructor() {
    // Initialize Firebase admin application
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: firebaseConfig.projectId,
          privateKey: firebaseConfig.privateKey.replace(/\\n/g, '\n'),
          clientEmail: firebaseConfig.clientEmail,
        }),
      });
    }

    // Set instance of admin.messaging.Messaging
    this.messaging = admin.messaging();
  }

  /**
   * @description tries to send push-notification
   */
  async sendNotification(params: SendNotificationParams): Promise<void> {
    const { token, data } = params;

    try {
      this.logger.verbose('Send push-notification...', { params });

      const message: admin.messaging.Message = {
        token,
        data: { notification: JSON.stringify(data) },
        android: { priority: 'high' },
      };

      await this.messaging.send(message);

      this.logger.verbose('Push-notification has been sent successfully!');
    } catch (error) {
      this.logger.error(
        'Error while sending push-notification',
        serializeError(error),
      );
    }
  }
}
