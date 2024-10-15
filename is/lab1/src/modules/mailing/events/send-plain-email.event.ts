import { SendEmailParams } from '../types/send-email.js';

export class SendPlainEmailEvent {
  constructor(readonly payload: SendEmailParams) {}
}
