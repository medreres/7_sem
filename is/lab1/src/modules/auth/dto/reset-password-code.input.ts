import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

import { RESET_PASSWORD_CODE_LENGTH } from '../constants.js';

export class ResetPasswordCodeInput {
  @ApiProperty({
    description: 'Code for resting password',
    maxLength: RESET_PASSWORD_CODE_LENGTH,
    minLength: RESET_PASSWORD_CODE_LENGTH,
  })
  @IsString()
  @Length(RESET_PASSWORD_CODE_LENGTH, RESET_PASSWORD_CODE_LENGTH)
  code: string;
}
