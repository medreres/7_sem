import { BadRequestException, ValidationPipe } from '@nestjs/common';

import type { ErrorOutput } from '../dto/error.output.js';

export const createClassValidatorPipe = (): ValidationPipe =>
  new ValidationPipe({
    exceptionFactory: (errors) => {
      const response: ErrorOutput = {
        errors: {},
      };

      errors.forEach((error) => {
        // * in error.constraints are listed all constraints for property (isEmail, isMin etc.)
        // * take first and show in response
        const constraintKey = Object.keys(error.constraints ?? {})[0];

        if (!error.constraints || !constraintKey) {
          return;
        }

        const propertyName = error.property;

        response.errors[propertyName] = error.constraints[constraintKey];
      });

      return new BadRequestException(response);
    },
    stopAtFirstError: true,
  });
