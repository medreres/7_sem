import { ApiProperty } from '@nestjs/swagger';

import { LocationDto } from './location.dto.js';

export class ShopDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  location: LocationDto;
}
