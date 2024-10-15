import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiForbiddenResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { UserGuard } from '../../auth/guards/user.guard.js';
import { Identity } from '../../auth/types/identity.js';
import { ErrorOutput } from '../../common/dto/error.output.js';
import { UserIdentity } from '../../user/decorators/user-identity.decorator.js';
import { ClaimAdapter } from '../adapters/claim.adapter.js';
import { ClaimDto } from '../dto/claim.dto.js';
import { RewardService } from '../reward.service.js';

@UseGuards(UserGuard)
@ApiTags('Claims')
@Controller('claims')
export class ClaimController {
  constructor(private readonly rewardService: RewardService) {}

  @Get('/my')
  @ApiOkResponse({
    description: 'Get user claims',
    type: [ClaimDto],
  })
  @ApiForbiddenResponse({
    description: 'Error message',
    type: ErrorOutput,
  })
  async getClaimsRewards(@UserIdentity() user: Identity): Promise<ClaimDto[]> {
    const claims = await this.rewardService.getClaimsByUserId(user.id);

    return claims.map((claim) => ClaimAdapter.toDto(claim));
  }
}
