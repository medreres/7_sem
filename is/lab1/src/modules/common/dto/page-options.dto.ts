import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

const MIN_PAGE = 1;
const DEFAULT_PAGE = 1;

const MIN_TAKE = 1;
const MAX_TAKE = 50;
const DEFAULT_TAKE = 10;

export class PageOptionsDto {
  @ApiPropertyOptional({
    minimum: MIN_PAGE,
    default: DEFAULT_PAGE,
  })
  @Type(() => Number)
  @IsInt()
  @Min(MIN_PAGE)
  @IsOptional()
  page: number = DEFAULT_PAGE;

  @ApiPropertyOptional({
    minimum: MIN_TAKE,
    maximum: MAX_TAKE,
    default: DEFAULT_TAKE,
  })
  @Type(() => Number)
  @IsInt()
  @Min(MIN_TAKE)
  @Max(MAX_TAKE)
  @IsOptional()
  take: number = DEFAULT_TAKE;
}
