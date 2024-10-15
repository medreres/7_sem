import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiForbiddenResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { UserGuard } from '../../auth/guards/user.guard.js';
import { Identity } from '../../auth/types/identity.js';
import { ErrorOutput } from '../../common/dto/error.output.js';
import { FileService } from '../../file/file.service.js';
import { UserIdentity } from '../../user/decorators/user-identity.decorator.js';
import { InvoiceAdapter } from '../adapters/invoice.adapter.js';
import { GenerateUploadUrlForInvoiceInput } from '../dtos/generate-upload-url-for-invoice/input.dto.js';
import { GenerateUploadUrlForInvoiceOutput } from '../dtos/generate-upload-url-for-invoice/output.dto.js';
import { InvoiceDto } from '../dtos/invoice.dto.js';
import { UpdateInvoiceInput } from '../dtos/update-invoice/input.dto.js';
import { InvoiceService } from '../invoice.service.js';

@ApiTags('invoices')
@UseGuards(UserGuard)
@Controller('invoices')
export class UserInvoiceController {
  constructor(
    private readonly invoiceService: InvoiceService,
    private readonly fileService: FileService,
  ) {}

  @ApiOkResponse({
    description: 'Create invoice',
    type: InvoiceDto,
  })
  @ApiForbiddenResponse({
    description: 'Error message',
    type: ErrorOutput,
  })
  @Post()
  async createInvoice(@UserIdentity() identity: Identity): Promise<InvoiceDto> {
    const invoice = await this.invoiceService.createInvoice(identity.id);

    return InvoiceAdapter.toDto(invoice);
  }

  @ApiOkResponse({
    description: 'Generate upload link for uploading file for invoice',
    type: GenerateUploadUrlForInvoiceOutput,
  })
  @ApiForbiddenResponse({
    description: 'Error message',
    type: ErrorOutput,
  })
  @Post('/:invoiceId/upload-url')
  async getUploadUrlForInvoice(
    @Param('invoiceId', ParseIntPipe) invoiceId: number,
    @UserIdentity() identity: Identity,
    @Body() input: GenerateUploadUrlForInvoiceInput,
  ): Promise<GenerateUploadUrlForInvoiceOutput> {
    await this.invoiceService.assertUserOwnsInvoice(identity.id, invoiceId);

    // TODO extract to attachment service to build urls there and encapsulate usage of file service
    // TODO extract path names to enum
    const link = await this.fileService.createUploadLink({
      path: `invoices/${invoiceId}/${input.fileName}`,
    });

    return {
      uploadLink: link,
    };
  }

  @ApiOkResponse({
    description: 'Update own invoice',
    type: InvoiceDto,
  })
  @ApiForbiddenResponse({
    description: 'Error message',
    type: ErrorOutput,
  })
  @Patch('/:invoiceId')
  async updateInvoice(
    @UserIdentity() identity: Identity,
    @Body() input: UpdateInvoiceInput,
    @Param('invoiceId', ParseIntPipe) invoiceId: number,
  ): Promise<InvoiceDto> {
    await this.invoiceService.assertUserOwnsInvoice(identity.id, invoiceId);

    const invoice = await this.invoiceService.updateInvoice({
      id: invoiceId,
      ...input,
    });

    return InvoiceAdapter.toDto(invoice);
  }

  @ApiOkResponse({
    description: 'Get specified invoice',
    type: InvoiceDto,
  })
  @ApiForbiddenResponse({
    description: 'Error message',
    type: ErrorOutput,
  })
  @Get('/:invoiceId')
  async getInvoice(
    @UserIdentity() identity: Identity,
    @Param('invoiceId', ParseIntPipe) invoiceId: number,
  ): Promise<InvoiceDto> {
    await this.invoiceService.assertUserOwnsInvoice(identity.id, invoiceId);

    const invoice = await this.invoiceService.getInvoiceByIdOrFail(invoiceId);

    return InvoiceAdapter.toDto(invoice);
  }
}
