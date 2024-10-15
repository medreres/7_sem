import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiForbiddenResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { PointTransactionAdapter } from './adapters/point-transaction.adapter.js';
import { CreatePointTransactionInput } from './dto/create-point-transaction/input.dto.js';
import { PointTransactionDto } from './dto/point-transaction.dto.js';
import { PointTransactionService } from './point-transaction.service.js';

import { AdminGuard } from '../auth/guards/admin.guard.js';
import { ErrorOutput } from '../common/dto/error.output.js';

@ApiTags('Points')
@UseGuards(AdminGuard)
@Controller('point-transactions')
export class PointTransactionController {
  constructor(
    private readonly pointTransactionService: PointTransactionService,
  ) {}

  @Post()
  @ApiOkResponse({
    description: 'Create new point transaction',
    type: PointTransactionDto,
  })
  @ApiForbiddenResponse({
    description: 'Error message',
    type: ErrorOutput,
  })
  async createPointTransaction(
    @Body() input: CreatePointTransactionInput,
  ): Promise<PointTransactionDto> {
    const data =
      await this.pointTransactionService.createPointTransaction(input);

    return PointTransactionAdapter.toDto(data);
  }

  @Delete(':pointTransactionId')
  @ApiOkResponse({
    description: 'Delete point transaction',
    type: PointTransactionDto,
  })
  // TODO extract error documentation errors to common decorator
  @ApiForbiddenResponse({
    description: 'Error message',
    type: ErrorOutput,
  })
  async deletePointTransaction(
    @Param('pointTransactionId', ParseIntPipe) pointTransactionId: number,
  ): Promise<PointTransactionDto> {
    const data =
      await this.pointTransactionService.deletePointTransaction(
        pointTransactionId,
      );

    return PointTransactionAdapter.toDto(data);
  }
}
