/* eslint-disable eslint-comments/require-description -- adminjs docs */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  ActionContext,
  ActionRequest,
  Before,
  flat,
  RecordError,
  ValidationError,
} from 'adminjs';

export const validateEmail: Before = (
  request: ActionRequest,
  context: ActionContext,
): ActionRequest => {
  const payload = flat.unflatten(request.payload) as {
    email: string;
    password: string;
  };

  const errors: { email?: RecordError; password?: RecordError } = {};

  if (!payload.email?.trim()?.length) {
    // @ts-expect-error -- adminjs docs
    errors.email = { message: context.translateMessage('Has to be filled') };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = emailRegex.test(payload.email);

  if (!isEmailValid) {
    // @ts-expect-error -- adminjs docs
    errors.email = { message: context.translateMessage('Has to be email') };
  }

  if (Object.keys(errors).length) {
    throw new ValidationError(errors);
  }

  return request;
};
