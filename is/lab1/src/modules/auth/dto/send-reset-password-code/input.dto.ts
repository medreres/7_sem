import { PickType } from '@nestjs/swagger';

import { BaseUser } from '../../../common/dto/base-user.js';

export class SendResetPasswordCodeInput extends PickType(BaseUser, ['email']) {}
