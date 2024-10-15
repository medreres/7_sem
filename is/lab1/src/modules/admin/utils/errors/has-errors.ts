import { ErrorOutput } from '../../../common/dto/error.output.js';

export const hasErrors = (response: object): response is ErrorOutput => {
  Object.hasOwn(response, 'errors');

  if ('errors' in response) {
    return true;
  }

  return false;
};
