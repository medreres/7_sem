import { RecordError } from 'adminjs';

import { ErrorOutput } from '../../common/dto/error.output.js';

export const parseErrors = <Type extends object>(
  response: ErrorOutput<Type>,
): Partial<Record<keyof Type, RecordError>> => {
  const errors: Partial<Record<keyof Type, RecordError>> = {};

  Object.entries(response.errors).forEach(([key, message]) => {
    errors[key] = { message };
  });

  return errors;
};
