import { Request } from 'express';

export const getRequestDestinationBaseUrl = (req: Request): string => {
  const origin = req.get('origin'); // 'example.com'

  if (origin) {
    return origin;
  }

  const { protocol } = req; // 'http' or 'https'
  const host = req.get('host'); // 'example.com'
  const fullUrl = `${protocol}://${host}`;

  return fullUrl;
};
