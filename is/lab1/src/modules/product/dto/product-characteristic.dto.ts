import { ApiProperty } from '@nestjs/swagger';

export class ProductCharacteristicDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  value: string;

  @ApiProperty()
  productId: number;
}
