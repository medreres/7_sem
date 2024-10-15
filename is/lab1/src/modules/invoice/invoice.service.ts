import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { InvoiceEntity } from './entities/invoice.entity.js';
import { InvoiceStatus } from './enums/invoice-status.enum.js';
import { ApproveInvoiceParams } from './types/approve-invoice-params.js';
import { RejectInvoiceParams } from './types/reject-invoice-params.js';
import { UpdateInvoiceParams } from './types/update-invoice.js';

import { AttachmentService } from '../attachment/attachment.service.js';
import { serializeError } from '../common/utils/serialize-error.js';
import { FileService } from '../file/file.service.js';
import { MailingEvent } from '../mailing/events/constants.js';
import { SendPlainEmailEvent } from '../mailing/events/send-plain-email.event.js';
import { SendEmailParams } from '../mailing/types/send-email.js';
import { PointTransactionEntity } from '../point-transaction/entities/point-transaction.entity.js';
import { PointTransactionService } from '../point-transaction/point-transaction.service.js';
import { UserService } from '../user/user.service.js';

@Injectable()
export class InvoiceService {
  private logger = new Logger(InvoiceService.name);

  constructor(
    @InjectRepository(InvoiceEntity)
    private invoiceRepository: Repository<InvoiceEntity>,
    private userService: UserService,
    private attachmentService: AttachmentService,
    private fileService: FileService,
    private pointTransactionService: PointTransactionService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async createInvoice(userId: number): Promise<InvoiceEntity> {
    return this.invoiceRepository.save({
      userId,
    });
  }

  async updateInvoice(params: UpdateInvoiceParams): Promise<InvoiceEntity> {
    const { id, fileName, ...restParams } = params;

    if (fileName) {
      const invoiceUrlFormatted = this.fileService.buildFileUrl(
        `invoices/${id}/${fileName}`,
      );

      await this.attachmentService.createOrUpdateExistingAttachment(
        { invoiceId: id },
        invoiceUrlFormatted,
      );

      this.logger.debug('Attached successfully');
    }

    await this.invoiceRepository.update(id, restParams);

    return this.getInvoiceByIdOrFail(id);
  }

  async assertUserOwnsInvoice(
    userId: number,
    invoiceId: number,
  ): Promise<void> {
    const invoice = await this.getInvoiceById(invoiceId);

    if (!invoice) {
      throw new BadRequestException('Invoice does not exist');
    }

    const { userId: invoiceOwnerId } = invoice;

    if (invoiceOwnerId !== userId) {
      throw new BadRequestException('Need to own invoice');
    }
  }

  async attachFileToInvoice(
    invoiceId: number,
    fileUrl: string,
  ): Promise<InvoiceEntity> {
    this.logger.debug('Creating attachment for invoice...');

    await this.attachmentService.createAttachment({
      fileUrl,
      invoiceId,
    });

    this.logger.debug('Attachment has been created');

    return this.getInvoiceByIdOrFail(invoiceId);
  }

  async getInvoiceByIdOrFail(invoiceId: number): Promise<InvoiceEntity> {
    return this.invoiceRepository.findOneOrFail({
      where: { id: invoiceId },
      relations: { attachments: true },
    });
  }

  async getInvoiceById(invoiceId: number): Promise<InvoiceEntity | null> {
    return this.invoiceRepository.findOne({ where: { id: invoiceId } });
  }

  async rejectInvoice(params: RejectInvoiceParams): Promise<boolean> {
    this.logger.debug('Rejecting invoice', params);
    const { invoiceId, reason } = params;

    await this.invoiceRepository.update(invoiceId, {
      status: InvoiceStatus.Rejected,
      rejectionReason: reason,
    });

    this.logger.debug('Invoice rejected');

    void this.sendInvoiceActionEmail(invoiceId, {
      subject: 'Invoice has been rejected',
      body: `Your invoice ${invoiceId} has been rejected\nReason: ${reason}`,
    });

    return true;
  }

  async approveInvoice(params: ApproveInvoiceParams): Promise<boolean> {
    const { invoiceId, pointsAmount, issuedAt } = params;

    this.logger.debug('Approving invoice', params);

    const transaction =
      await this.createPointTransactionForApprovedInvoice(params);

    await this.invoiceRepository.update(invoiceId, {
      status: InvoiceStatus.Approved,
      pointTransaction: { id: transaction.id },
      issuedAt,
    });

    void this.sendInvoiceActionEmail(invoiceId, {
      subject: 'Invoice has been approved',
      body: `Your invoice ${invoiceId} has been approved\nPoints: ${pointsAmount}`,
    });

    return true;
  }

  private async sendInvoiceActionEmail(
    invoiceId: number,
    data: Pick<SendEmailParams, 'body' | 'subject'>,
  ): Promise<void> {
    try {
      const invoice = await this.getInvoiceByIdOrFail(invoiceId);

      const user = await this.userService.getUserByIdOrFail(invoice.userId);

      this.eventEmitter.emit(
        MailingEvent.SendPlainEmail,
        new SendPlainEmailEvent({
          recipients: [user.email],
          ...data,
        }),
      );
    } catch (error) {
      this.logger.error('Error when sending invoice info email');
      this.logger.debug(serializeError(error));
    }
  }

  private async createPointTransactionForApprovedInvoice(
    params: ApproveInvoiceParams,
  ): Promise<PointTransactionEntity> {
    const { invoiceId, pointsAmount } = params;
    const invoice = await this.getInvoiceByIdOrFail(invoiceId);

    this.logger.debug('Creating new point transaction...');

    const transaction =
      await this.pointTransactionService.createPointTransaction({
        amount: pointsAmount,
        userId: invoice.userId,
        invoiceId,
        description: `Approved invoice ${invoiceId}`,
      });

    return transaction;
  }
}
