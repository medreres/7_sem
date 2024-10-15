import { ActionResponse, RecordActionResponse } from 'adminjs';

import { ExtendedInvoice } from './types.js';

import { AttachmentEntity } from '../../../../attachment/entities/attachment.entity.js';
import { PointTransactionEntity } from '../../../../point-transaction/entities/point-transaction.entity.js';
import { UserEntity } from '../../../../user/entities/user.entity.js';

export const handleShowAfter = async (res): Promise<ActionResponse> => {
  const response = res as RecordActionResponse;
  const invoice = response.record.params as ExtendedInvoice;

  const attachment = await AttachmentEntity.findOne({
    where: { invoiceId: invoice.id },
  });

  const user = await UserEntity.getRepository().findOne({
    where: { id: invoice.userId },
  });

  invoice.userName = `${user?.firstName} ${user?.lastName}`; // Attach user name to the record

  invoice.attachments = attachment ? [attachment] : [];

  if (invoice.pointTransactionId) {
    const transaction =
      await PointTransactionEntity.getRepository().findOneOrFail({
        where: { id: invoice.pointTransactionId },
      });

    invoice.numberOfPoints = transaction.amount;
  }

  return response;
};
