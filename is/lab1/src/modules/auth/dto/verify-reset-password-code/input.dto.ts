import { IntersectionType, PickType } from '@nestjs/swagger';

import { BaseUser } from '../../../common/dto/base-user.js';
import { ResetPasswordCodeInput } from '../reset-password-code.input.js';

export class VerifyResetPasswordCodeInput extends IntersectionType(
  PickType(BaseUser, ['email']),
  ResetPasswordCodeInput,
) {}
