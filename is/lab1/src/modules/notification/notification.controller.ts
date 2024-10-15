import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import { NotificationAdapter } from './adapters/notification.adapter.js';
import { NotificationDto } from './dto/notification.dto.js';
import { NotificationService } from './notification.service.js';
import { GetNotificationsInput } from './types/get-notifications/input.js';
import { GetNotificationsOutput } from './types/get-notifications/output.js';

import { UserGuard } from '../auth/guards/user.guard.js';
import { Identity } from '../auth/types/identity.js';
import { ErrorOutput } from '../common/dto/error.output.js';
import { SuccessOutput } from '../common/dto/sucess.output.js';
import { preparePageResult } from '../common/utils/page-result.js';
import { UserIdentity } from '../user/decorators/user-identity.decorator.js';

@UseGuards(UserGuard)
@ApiTags('Notifications')
@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @ApiOkResponse({
    description: 'Get paginated notifications.',
    type: GetNotificationsOutput,
  })
  @ApiForbiddenResponse({
    description: 'Error message',
    type: ErrorOutput,
  })
  async getNotifications(
    @UserIdentity() user: Identity,
    @Query() query: GetNotificationsInput,
  ): Promise<GetNotificationsOutput> {
    const { notifications, itemsCount } =
      await this.notificationService.getPaginatedNotificationsByUserId({
        ...query,
        userId: user.id,
      });

    const unreadCount =
      await this.notificationService.getUnreadNotificationsCountByUserId(
        user.id,
      );

    const pageResult = preparePageResult<NotificationDto>(
      query,
      itemsCount,
      notifications.map((notification) =>
        NotificationAdapter.toDto(notification),
      ),
    );

    return { ...pageResult, unreadCount };
  }

  @Get('/:id')
  @ApiOkResponse({
    description: 'Get specified notification.',
    type: NotificationDto,
  })
  @ApiBadRequestResponse({
    description: 'Not existing notification id',
    type: ErrorOutput,
  })
  @ApiForbiddenResponse({
    description: 'Error message',
    type: ErrorOutput,
  })
  async getNotification(
    @UserIdentity() user: Identity,
    @Param('id', ParseIntPipe) notificationId: number,
  ): Promise<NotificationDto> {
    const notification = await this.notificationService.getNotification({
      notificationId,
      userId: user.id,
    });

    return NotificationAdapter.toDto(notification);
  }

  @Patch('/read-all')
  @ApiOkResponse({
    description: 'Mark all user notifications as read.',
    type: SuccessOutput,
  })
  @ApiForbiddenResponse({
    description: 'Error message',
    type: ErrorOutput,
  })
  async marAllNotificationsAsRead(
    @UserIdentity() user: Identity,
  ): Promise<SuccessOutput> {
    await this.notificationService.markAllNotificationsAsRead(user.id);

    return { message: 'Notifications marked as read.' };
  }

  @Patch('/:id')
  @ApiOkResponse({
    description: 'Mark specified notification as read.',
    type: SuccessOutput,
  })
  @ApiForbiddenResponse({
    description: 'Error message',
    type: ErrorOutput,
  })
  async markNotificationAsRead(
    @UserIdentity() user: Identity,
    @Param('id', ParseIntPipe) notificationId: number,
  ): Promise<SuccessOutput> {
    await this.notificationService.markNotificationAsRead({
      notificationId,
      userId: user.id,
    });

    return { message: 'Notification marked as read.' };
  }

  @Delete('/:id')
  @ApiOkResponse({
    description: 'Delete specified notification.',
    type: SuccessOutput,
  })
  @ApiForbiddenResponse({
    description: 'Error message',
    type: ErrorOutput,
  })
  async deleteNotification(
    @UserIdentity() user: Identity,
    @Param('id', ParseIntPipe) notificationId: number,
  ): Promise<SuccessOutput> {
    await this.notificationService.deleteNotification({
      notificationId,
      userId: user.id,
    });

    return { message: 'Notification has been deleted.' };
  }
}
