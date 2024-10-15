import { SendEmailParams } from '../types/send-email.js';

export class SendHtmlEmailEvent {
  constructor(readonly payload: SendEmailParams) {}
}
