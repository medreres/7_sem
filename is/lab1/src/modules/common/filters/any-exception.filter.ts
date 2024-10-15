/* eslint-disable @typescript-eslint/no-explicit-any -- express incompatibility with types */
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import * as Sentry from '@sentry/nestjs';
import { Response } from 'express';

import { BadRequestException } from '../exceptions/bad-request.exception.js';
import { serializeError } from '../utils/serialize-error.js';

@Catch()
export class AnyExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AnyExceptionFilter.name);

  catch(
    exception: unknown,
    host: ArgumentsHost,
  ): Response<any, Record<string, any>> {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    Sentry.captureException(exception);

    this.logger.error(serializeError(exception));

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
      new BadRequestException({
        field: 'root',
        message: 'Internal server error',
      }),
    );
  }
}
