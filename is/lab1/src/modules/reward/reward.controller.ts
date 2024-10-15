import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import { RewardAdapter } from './adapters/reward.adapter.js';
import { GetRewardsInput } from './dto/get-rewards/input.js';
import { GetRewardsOutput } from './dto/get-rewards/output.js';
import { RewardWithStatusDto } from './dto/reward-with-status.dto.js';
import { RewardService } from './reward.service.js';

import { UserGuard } from '../auth/guards/user.guard.js';
import { Identity } from '../auth/types/identity.js';
import { ErrorOutput } from '../common/dto/error.output.js';
import { preparePageResult } from '../common/utils/page-result.js';
import { UserIdentity } from '../user/decorators/user-identity.decorator.js';

@UseGuards(UserGuard)
@ApiTags('Rewards')
@Controller('rewards')
export class RewardController {
  constructor(private readonly rewardService: RewardService) {}

  @Get()
  @ApiOkResponse({
    description: 'Get paginated rewards',
    type: GetRewardsOutput,
  })
  @ApiForbiddenResponse({
    description: 'Error message',
    type: ErrorOutput,
  })
  async getRewards(
    @UserIdentity() user: Identity,
    @Query() query: GetRewardsInput,
  ): Promise<GetRewardsOutput> {
    const { rewards, itemsCount } =
      await this.rewardService.getPaginatedRewardsByUserId({
        ...query,
        userId: user.id,
      });

    const result = preparePageResult<RewardWithStatusDto>(
      query,
      itemsCount,
      rewards.map(({ reward, status }) => RewardAdapter.toDto(reward, status)),
    );

    return result;
  }

  @Get('/:id')
  @ApiOkResponse({
    description: 'Get specified reward',
    type: RewardWithStatusDto,
  })
  @ApiBadRequestResponse({
    description: 'Not existing reward id',
    type: ErrorOutput,
  })
  @ApiForbiddenResponse({
    description: 'Error message',
    type: ErrorOutput,
  })
  async getReward(
    @UserIdentity() user: Identity,
    @Param('id', ParseIntPipe) rewardId: number,
  ): Promise<RewardWithStatusDto> {
    const result = await this.rewardService.getRewardWithStatusByUserIdOrFail({
      userId: user.id,
      rewardId,
    });

    return RewardAdapter.toDto(result.reward, result.status);
  }
}
