import { ActionResponse } from 'adminjs';
import { In } from 'typeorm';

import { ExtendedInvoice } from './types.js';

import { PointTransactionEntity } from '../../../../point-transaction/entities/point-transaction.entity.js';
import { UserEntity } from '../../../../user/entities/user.entity.js';

export const handleListAfter = async (res): Promise<ActionResponse> => {
  const response = res as {
    records: { params: ExtendedInvoice }[];
  };

  const userIdToInvoice: Record<number, ExtendedInvoice> = {};
  const invoiceIdToTransaction: Record<number, PointTransactionEntity> = {};

  const transactionsIds: number[] = [];

  const userIds = response.records.map(({ params }) => {
    userIdToInvoice[params.userId] = params;

    if (params.pointTransactionId) {
      transactionsIds.push(params.pointTransactionId);
    }

    return params.userId;
  });

  const transactions = await PointTransactionEntity.getRepository().find({
    where: { id: In(transactionsIds) },
  });

  transactions.forEach((transaction) => {
    if (!transaction.invoiceId) {
      return;
    }

    invoiceIdToTransaction[transaction.invoiceId] = transaction;
  });

  const users = await UserEntity.find({ where: { id: In(userIds) } });
  const userIdToUser: Record<number, UserEntity> = {};

  users.forEach((user) => {
    userIdToUser[user.id] = user;
  });

  response.records.forEach(({ params }) => {
    const invoice = params;
    const user = userIdToUser[invoice.userId];

    if (!user) {
      return;
    }

    invoice.userName = `${user.firstName} ${user.lastName}`;

    invoice.numberOfPoints = invoiceIdToTransaction[invoice.id]?.amount;
  });

  return response;
};
