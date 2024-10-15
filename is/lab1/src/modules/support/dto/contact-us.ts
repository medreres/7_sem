import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class ContactUsInput {
  @ApiProperty({ description: 'Sender name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Reply to email' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Message text' })
  @IsString()
  message: string;
}
