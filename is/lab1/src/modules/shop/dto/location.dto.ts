import { ApiProperty } from '@nestjs/swagger';

export class LocationDto {
  @ApiProperty()
  latitude: number;

  @ApiProperty()
  longitude: number;
}
