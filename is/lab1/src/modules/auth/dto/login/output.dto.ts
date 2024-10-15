import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginOutput {
  @ApiProperty({ description: "Access token used to verify user's identity" })
  @IsString()
  accessToken: string;
}
