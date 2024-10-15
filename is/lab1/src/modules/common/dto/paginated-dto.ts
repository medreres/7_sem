import { ApiProperty } from '@nestjs/swagger';

import { PageMetaDto } from './page-meta.dto.js';

export class PaginatedDto {
  @ApiProperty({ type: () => PageMetaDto, description: 'Pagination metadata' })
  meta: PageMetaDto;
}
