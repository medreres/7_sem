import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiForbiddenResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { UserGuard } from '../../auth/guards/user.guard.js';
import { Identity } from '../../auth/types/identity.js';
import { ErrorOutput } from '../../common/dto/error.output.js';
import { UserAdapter } from '../adapters/user.adapter.js';
import { UserStatusAdapter } from '../adapters/user-status.adapter.js';
import { UserIdentity } from '../decorators/user-identity.decorator.js';
import { EditUserInput } from '../dto/edit-user/input.dto.js';
import { StatusDto } from '../dto/status.dto.js';
import { UserDto } from '../dto/user.dto.js';
import { UserService } from '../user.service.js';

@Controller('/users')
@ApiTags('users')
@UseGuards(UserGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/me')
  @ApiOkResponse({
    description: 'Returns basic info about the user',
    type: UserDto,
  })
  @ApiForbiddenResponse({
    description: 'Error message',
    type: ErrorOutput,
  })
  @UseGuards(UserGuard)
  async getMe(@UserIdentity() user: Identity): Promise<UserDto> {
    const data = await this.userService.getUserByIdOrFail(user.id);

    return UserAdapter.toDto(data);
  }

  @Patch('/me')
  @ApiOkResponse({
    description: 'Updates user info',
    type: UserDto,
  })
  @ApiForbiddenResponse({
    description: 'Error message',
    type: ErrorOutput,
  })
  async updateMe(
    @UserIdentity() user: Identity,
    @Body() input: EditUserInput,
  ): Promise<UserDto> {
    const data = await this.userService.updateUserById({
      id: user.id,
      data: input,
    });

    return UserAdapter.toDto(data);
  }

  @Get('/status')
  @ApiOkResponse({
    description: "Returns basic info about the user's status",
    type: StatusDto,
  })
  @ApiForbiddenResponse({
    description: 'Error message',
    type: ErrorOutput,
  })
  async myStatus(@UserIdentity() user: Identity): Promise<StatusDto> {
    const { currentStatus, nextStatus, pointsAmount } =
      await this.userService.getUserStatusInfo(user.id);

    return {
      currentStatus: UserStatusAdapter.toDto(currentStatus),
      nextStatus: nextStatus ? UserStatusAdapter.toDto(nextStatus) : undefined,
      pointsAmount,
    };
  }

  @Delete('/me')
  @ApiOkResponse({
    description: "Deletes user's account",
    type: UserDto,
  })
  @ApiForbiddenResponse({
    description: 'Error message',
    type: ErrorOutput,
  })
  async deleteMe(@UserIdentity() user: Identity): Promise<UserDto> {
    const data = await this.userService.deactivateUserById(user.id);

    return UserAdapter.toDto(data);
  }
}
