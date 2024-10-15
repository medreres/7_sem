import { Logger, Module } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AdminInvoiceController } from './controllers/admin-invoice.controller.js';
import { UserInvoiceController } from './controllers/user-invoice.controller.js';
import { InvoiceEntity } from './entities/invoice.entity.js';
import { InvoiceStatus } from './enums/invoice-status.enum.js';
import { InvoiceService } from './invoice.service.js';

import { AttachmentModule } from '../attachment/attachment.module.js';
import { FileModule } from '../file/file.module.js';
import { PointTransactionEvent } from '../point-transaction/events/constants.js';
import { DeletePointTransactionEvent } from '../point-transaction/events/delete-point-transaction.event.js';
import { PointTransactionModule } from '../point-transaction/point-transaction.module.js';
import { UserModule } from '../user/user.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([InvoiceEntity]),
    UserModule,
    FileModule,
    AttachmentModule,
    PointTransactionModule,
  ],
  controllers: [AdminInvoiceController, UserInvoiceController],
  providers: [InvoiceService],
})
export class InvoiceModule {
  private logger = new Logger(InvoiceModule.name);

  constructor(private readonly invoiceService: InvoiceService) {}

  @OnEvent(PointTransactionEvent.DeleteTransaction)
  async oneDeletePointTransactionEvent(
    event: DeletePointTransactionEvent,
  ): Promise<void> {
    const {
      payload: { pointTransaction },
    } = event;

    // * reset invoice if previously has been rejected or approved
    if (
      pointTransaction.invoice &&
      pointTransaction.invoice?.status !== InvoiceStatus.Open
    ) {
      this.logger.debug('Reset invoice status to open', {
        pointTransaction,
      });

      await this.invoiceService.updateInvoice({
        id: pointTransaction.invoice?.id,
        status: InvoiceStatus.Open,
      });
    }
  }
}
