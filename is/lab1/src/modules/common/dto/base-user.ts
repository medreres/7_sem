import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

import { POSTAL_CODE_REGEX } from '../../auth/constants.js';
import { IsPassword } from '../../user/decorators/is-password.decorator.js';
import { Country } from '../../user/enums/country.enum.js';
import { User } from '../../user/types/user.js';

export class BaseUser
  implements Omit<User, 'id' | 'pointsAmount' | 'status' | 'role'>
{
  @ApiProperty()
  @IsEmail({}, { message: 'Must be valid email' })
  email: string;

  @IsPassword()
  password: string;

  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty({ nullable: true, example: '2024-08-14' })
  @IsDateString()
  @IsOptional()
  dateOfBirth?: Date;

  @ApiProperty({ description: 'Phone number' })
  @IsString()
  phone: string;

  @ApiProperty({ description: 'Company/Trading Name' })
  @IsString()
  businessName: string;

  @ApiProperty()
  @IsString()
  city: string;

  @ApiProperty({ enum: Country })
  @IsEnum(Country)
  country: Country;

  @ApiProperty({ examples: ['AA99 9AA', 'AA9A 9AA'] })
  @Matches(POSTAL_CODE_REGEX)
  postalCode: string;

  @ApiProperty({
    description: "User's address",
  })
  @IsString()
  address: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isActive: boolean;

  @ApiProperty({ description: 'Token to send push notification to' })
  @IsString()
  @IsOptional()
  deviceToken?: string;
}
