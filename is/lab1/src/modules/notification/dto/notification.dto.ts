import { ApiProperty } from '@nestjs/swagger';

import { AttachmentDto } from '../../common/dto/attachment.dto.js';
import { NotificationStatus } from '../enums/notification-status.enum.js';

export class NotificationDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  title: string;

  @ApiProperty()
  message: string;

  @ApiProperty()
  status: NotificationStatus;

  @ApiProperty({ type: [AttachmentDto] })
  attachments: AttachmentDto[];
}
