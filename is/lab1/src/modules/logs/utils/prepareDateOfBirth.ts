import { LogDifference } from '../types/log.js';

export const prepareDateOfBirth = (difference: string): string => {
  const differenceObj = JSON.parse(difference) as Record<string, unknown>;

  // don't log dateOfBirth field if it is not changed
  if (differenceObj['dateOfBirth']) {
    const dateOfBirth = differenceObj['dateOfBirth'] as LogDifference;

    const [beforeDateOnly] = dateOfBirth.before.split('T');
    const [afterDateOnly] = dateOfBirth.after.split('T');

    if (beforeDateOnly && afterDateOnly) {
      if (beforeDateOnly === afterDateOnly) {
        delete differenceObj['dateOfBirth'];
      }

      dateOfBirth.before = beforeDateOnly;
      dateOfBirth.after = afterDateOnly;
    }

    return JSON.stringify(differenceObj);
  }

  return difference;
};
