import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumberString } from 'class-validator';

import { BaseUser } from '../../../common/dto/base-user.js';
import { UserRole } from '../../enums/user-status.enum.js';
import { User } from '../../types/user.js';

export class CreateUserInput
  extends BaseUser
  implements Omit<User, 'id' | 'pointsAmount' | 'status'>
{
  @ApiProperty({ enum: UserRole })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({})
  @IsNumberString()
  statusId: number;
}
