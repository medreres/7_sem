import {
  Request as ExpressRequest,
  Response as ExpressResponse,
} from 'express';

export type ExpressContext = {
  req: ExpressRequest;
  res: ExpressResponse;
};

export type Response = ExpressResponse;
