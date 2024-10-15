import { ApiProperty, PickType } from '@nestjs/swagger';

import { BaseUser } from '../../common/dto/base-user.js';
import { UserRole, UserStatus } from '../enums/user-status.enum.js';
import { User } from '../types/user.js';

export class UserDto
  extends PickType(BaseUser, [
    'email',
    'address',
    'businessName',
    'city',
    'country',
    'dateOfBirth',
    'firstName',
    'lastName',
    'phone',
    'postalCode',
    'isActive',
    'deviceToken',
  ])
  implements User
{
  @ApiProperty()
  id: number;

  @ApiProperty({ enum: UserRole })
  role: UserRole;

  @ApiProperty({ enum: UserStatus })
  status: UserStatus;

  @ApiProperty()
  pointsAmount: number;

  @ApiProperty()
  pointsExpireAt: Date;
}
