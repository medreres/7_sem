import { ApiProperty } from '@nestjs/swagger';
import { Length, Matches } from 'class-validator';

import {
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
  PASSWORD_LENGTH_ERROR,
  PASSWORD_REGEX_ERROR,
  PASSWORD_VALIDATION_REGEX,
} from '../../auth/constants.js';

export function IsPassword() {
  return function isPassword(object: object, propertyName: string) {
    // Apply other validators directly
    ApiProperty({
      minLength: MIN_PASSWORD_LENGTH,
      maxLength: MAX_PASSWORD_LENGTH,
      description: PASSWORD_REGEX_ERROR,
    })(object, propertyName);

    Length(MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH, {
      message: PASSWORD_LENGTH_ERROR,
    })(object, propertyName);

    Matches(PASSWORD_VALIDATION_REGEX, {
      message: PASSWORD_REGEX_ERROR,
    })(object, propertyName);
  };
}
