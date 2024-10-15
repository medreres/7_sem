import { PageMetaDto } from '../dto/page-meta.dto.js';
import { PageOptionsDto } from '../dto/page-options.dto.js';

export const preparePageResult = <T>(
  query: PageOptionsDto,
  itemsCount: number,
  data: T[],
): { data: T[]; meta: PageMetaDto } => {
  const pageMetaDto = new PageMetaDto({
    itemsCount,
    pageOptions: query,
  });

  return {
    data,
    meta: pageMetaDto,
  };
};
