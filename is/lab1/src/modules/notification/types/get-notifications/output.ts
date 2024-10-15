import { ApiProperty } from '@nestjs/swagger';

import { PaginatedDto } from '../../../common/dto/paginated-dto.js';
import { NotificationDto } from '../../dto/notification.dto.js';

export class GetNotificationsOutput extends PaginatedDto {
  @ApiProperty({ type: () => [NotificationDto] })
  data: NotificationDto[];

  @ApiProperty({ type: () => Number })
  unreadCount: number;
}
