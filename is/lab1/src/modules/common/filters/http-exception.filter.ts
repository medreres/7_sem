/* eslint-disable @typescript-eslint/no-explicit-any -- express types */
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

import { ErrorOutput } from '../dto/error.output.js';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(
    exception: HttpException,
    host: ArgumentsHost,
  ): Response<any, Record<string, any>> {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const exceptionResponse = exception.getResponse();

    if (
      typeof exceptionResponse === 'object' &&
      'errors' in exceptionResponse
    ) {
      return response
        .status(exception.getStatus())
        .json(exception.getResponse());
    }

    const customResponse = {
      errors: {
        root: exception.message,
      },
    } satisfies ErrorOutput;

    return response.status(exception.getStatus()).json(customResponse);
  }
}
