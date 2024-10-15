import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';

const LATITUDE_MAX = 90;
const LONGITUDE_MAX = 180;

export class SearchShopsInput {
  @ApiProperty({ description: 'Map center location latitude value' })
  @IsNumber()
  @Min(-LATITUDE_MAX)
  @Max(LATITUDE_MAX)
  @Transform(({ value }) => parseFloat(value as string))
  mapCenterLatitude: number;

  @ApiProperty({ description: 'Map center location longitude value' })
  @IsNumber()
  @Min(-LONGITUDE_MAX)
  @Max(LONGITUDE_MAX)
  @Transform(({ value }) => parseFloat(value as string))
  mapCenterLongitude: number;

  @ApiPropertyOptional({ description: 'User current location latitude value' })
  @IsOptional()
  @IsNumber()
  @Min(-LATITUDE_MAX)
  @Max(LATITUDE_MAX)
  @Transform(({ value }) => parseFloat(value as string))
  userLatitude: number;

  @ApiPropertyOptional({ description: 'User current location longitude value' })
  @IsOptional()
  @IsNumber()
  @Min(-LONGITUDE_MAX)
  @Max(LONGITUDE_MAX)
  @Transform(({ value }) => parseFloat(value as string))
  userLongitude: number;

  @ApiPropertyOptional({
    description:
      'Radius within which to search for shops, specified in kilometers',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) =>
    typeof value === 'undefined' ? value : parseFloat(value as string),
  )
  radiusInKm?: number;

  @ApiPropertyOptional({ description: 'Shops limit' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) =>
    typeof value === 'undefined' ? value : parseFloat(value as string),
  )
  limit?: number;
}
