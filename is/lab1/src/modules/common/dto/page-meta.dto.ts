import { ApiProperty } from '@nestjs/swagger';

import { PageOptionsDto } from './page-options.dto.js';

export interface PageMetaDtoParameters {
  itemsCount: number;
  pageOptions: PageOptionsDto;
}

export class PageMetaDto {
  @ApiProperty({ description: 'Page number' })
  page: number;

  @ApiProperty({ description: 'Items per page' })
  take: number;

  @ApiProperty({ description: 'Total items count' })
  itemsCount: number;

  @ApiProperty({ description: 'Total pages count' })
  pagesCount: number;

  constructor({ pageOptions, itemsCount }: PageMetaDtoParameters) {
    this.page = pageOptions.page!;
    this.take = pageOptions.take!;
    this.itemsCount = itemsCount;
    this.pagesCount = Math.ceil(this.itemsCount / this.take);
  }
}
