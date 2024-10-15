import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { ValidateIf } from 'class-validator';

import { BaseUser } from '../../../common/dto/base-user.js';
import { IsPassword } from '../../decorators/is-password.decorator.js';

export class EditUserInput extends PartialType(
  OmitType(BaseUser, ['password', 'email']),
) {
  @ValidateIf((user: EditUserInput) => Boolean(user.newPassword))
  @ApiProperty({
    nullable: true,
    description: "Old user's password",
  })
  @IsPassword()
  oldPassword?: string;

  @ValidateIf((user: EditUserInput) => Boolean(user.oldPassword))
  @ApiProperty({
    nullable: true,
    description: 'New password',
  })
  @IsPassword()
  newPassword?: string;
}
