import { ApiProperty } from '@nestjs/swagger';

export class SuccessOutput {
  @ApiProperty({
    description: 'Success message',
    example: 'Signed out successfully',
  })
  message: string;
}
