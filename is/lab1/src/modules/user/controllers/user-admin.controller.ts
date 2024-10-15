import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { AdminGuard } from '../../auth/guards/admin.guard.js';
import { ErrorOutput } from '../../common/dto/error.output.js';
import { UserAdapter } from '../adapters/user.adapter.js';
import { CreateUserInput } from '../dto/create-user/input.dto.js';
import { CreateUserOutput } from '../dto/create-user/output.dto.js';
import { UserService } from '../user.service.js';

@Controller('/users')
@ApiTags('users')
@UseGuards(AdminGuard)
export class UserAdminController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOkResponse({
    description: 'User has been created successfully',
    type: CreateUserOutput,
  })
  @ApiNotFoundResponse({
    description: 'Creation failed',
    type: ErrorOutput,
  })
  async createUser(
    @Body() input: CreateUserInput,
  ): Promise<CreateUserOutput | ErrorOutput> {
    const response = await this.userService.createUser(input);

    return UserAdapter.toDto(response);
  }
}
