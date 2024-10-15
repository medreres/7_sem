import { PickType } from '@nestjs/swagger';

import { BaseUser } from '../../../common/dto/base-user.js';

export class LoginInput extends PickType(BaseUser, ['email', 'password']) {}
