import { createClaimResource } from './claim/claim.resource.js';
import { createInvoiceResource } from './invoice/invoice.resource.js';
import { createPointTransactionResource } from './point-transaction/point-transaction.resource.js';
import { createUserResource } from './user/user.resource.js';
import { createUserStatusResource } from './user-status.resource.js';

export default [
  createUserResource,
  createUserStatusResource,
  createInvoiceResource,
  createPointTransactionResource,
  createClaimResource,
];
