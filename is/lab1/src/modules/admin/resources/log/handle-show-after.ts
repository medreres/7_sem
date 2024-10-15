import { RecordActionResponse } from 'adminjs';

import { Log } from '../../../logs/types/log.js';

interface DifferenceWithDates {
  createdAt?: string;
  updatedAt?: string;
}

export const handleShowAfter = (
  response: RecordActionResponse,
): RecordActionResponse => {
  const params = response.record?.params as Log;

  if (params.difference) {
    const difference = JSON.parse(params.difference) as DifferenceWithDates;

    delete difference.createdAt;
    delete difference.updatedAt;

    params.difference = JSON.stringify(difference);
  }

  return response;
};
