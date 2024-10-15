import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiForbiddenResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { AdminGuard } from '../../auth/guards/admin.guard.js';
import { ErrorOutput } from '../../common/dto/error.output.js';
import { SuccessOutput } from '../../common/dto/sucess.output.js';
import { ApproveInvoiceInput } from '../dtos/approve-invoice/input.dto.js';
import { RejectInvoiceInput } from '../dtos/reject-invoice/input.dto.js';
import { InvoiceService } from '../invoice.service.js';

@ApiTags('invoices')
@UseGuards(AdminGuard)
@Controller('invoices')
export class AdminInvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @ApiOkResponse({
    description: 'Reject invoice',
    type: SuccessOutput,
  })
  @ApiForbiddenResponse({
    description: 'Error message',
    type: ErrorOutput,
  })
  @Post(':id/reject')
  async rejectInvoice(
    @Body() input: RejectInvoiceInput,
    @Param('id', ParseIntPipe) invoiceId: number,
  ): Promise<SuccessOutput> {
    await this.invoiceService.rejectInvoice({
      invoiceId,
      reason: input.reason,
    });

    return { message: 'Invoice has been rejected' };
  }

  @ApiOkResponse({
    description: 'Approve invoice',
    type: SuccessOutput,
  })
  @ApiForbiddenResponse({
    description: 'Error message',
    type: ErrorOutput,
  })
  @Post(':id/approve')
  async approveInvoice(
    @Body() input: ApproveInvoiceInput,
    @Param('id', ParseIntPipe) invoiceId: number,
  ): Promise<SuccessOutput> {
    await this.invoiceService.approveInvoice({
      invoiceId,
      ...input,
    });

    return { message: 'Invoice has been approved' };
  }
}
