/* eslint-disable eslint-comments/require-description -- adminjs docs */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ActionRequest, Before, RecordError, ValidationError } from 'adminjs';
import { isEmail, matches } from 'class-validator';

import {
  PASSWORD_REGEX_ERROR,
  PASSWORD_VALIDATION_REGEX,
} from '../../auth/constants.js';
import { CryptoService } from '../../crypto/crypto.service.js';
import { ExtendedUser } from '../resources/user/user/types.js';

type ActionRequestWithNewPassword = ActionRequest & {
  fields?: {
    newPassword?: string;
  };
};

type Fields = keyof ExtendedUser;

export const validateUser: Before = async (
  request: ActionRequestWithNewPassword,
): Promise<ActionRequest> => {
  const payload = request.payload as ExtendedUser;

  const newPassword = request.fields?.newPassword;

  if (request.method === 'get') {
    return request;
  }

  const errors: Partial<Record<Fields, RecordError>> = {};

  const isEmailValid = isEmail(payload.email);

  let isPasswordValid = true;

  if (newPassword) {
    isPasswordValid = matches(newPassword, PASSWORD_VALIDATION_REGEX);
  }

  if (!isEmailValid) {
    errors.email = { message: 'Invalid email' };
  }

  if (!payload.statusId) {
    errors.statusId = { message: 'Is required' };
  }

  if (!payload.role) {
    errors.role = { message: 'Is required' };
  }

  if (!isPasswordValid) {
    errors.password = { message: PASSWORD_REGEX_ERROR };
    errors.newPassword = { message: PASSWORD_REGEX_ERROR };
  }

  if (Object.keys(errors).length) {
    throw new ValidationError(errors);
  }

  // TODO rework this to use server hashing
  if (newPassword) {
    payload.password = await new CryptoService().hashPassword(newPassword);
  }

  return request;
};
