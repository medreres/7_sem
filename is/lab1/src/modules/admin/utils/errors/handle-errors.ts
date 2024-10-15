import { NoticeMessage, ValidationError } from 'adminjs';

import { ErrorOutput } from '../../../common/dto/error.output.js';
import { parseErrors } from '../parse-errors.js';

type HandleErrorsReturnType = { notice: NoticeMessage };

export const handleErrors = (
  response: ErrorOutput,
): HandleErrorsReturnType | never => {
  if (response.errors.root) {
    return {
      notice: {
        message: response.errors.root,
        type: 'error',
      },
    };
  }

  const errors = parseErrors(response);

  throw new ValidationError(errors);
};
