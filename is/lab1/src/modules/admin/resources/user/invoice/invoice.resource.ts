import { targetRelationSettingsFeature } from '@adminjs/relations';

import { handleApprove } from './handle-approve.js';
import { handleInvoiceActionIsVisible } from './handle-approve-is-visible.js';
import { handleListAfter } from './handle-list-after.js';
import { handleReject } from './handle-reject.js';
import { handleShowAfter } from './handle-show-after.js';
import { ExtendedInvoice } from './types.js';

import { InvoiceEntity } from '../../../../invoice/entities/invoice.entity.js';
import { components } from '../../../components/index.js';
import { Resource } from '../../../types/resource.js';
import { loggerFeatureSetup } from '../../log/feature.js';
import { navigation } from '../navigation.js';
import { POINT_TRANSACTION_RESOURCE_ID } from '../point-transaction/point-transaction.resource.js';
import { USER_RESOURCE_ID } from '../user/user.resource.js';

export const INVOICE_RESOURCE_ID = 'Invoices';

export const createInvoiceResource = (): Resource<ExtendedInvoice> => ({
  resource: InvoiceEntity,
  options: {
    navigation,
    id: INVOICE_RESOURCE_ID,
    sort: { sortBy: 'status', direction: 'asc' },
    actions: {
      new: { isAccessible: false },
      delete: { isAccessible: false },
      bulkDelete: { isAccessible: false },
      show: {
        after: handleShowAfter,
      },
      list: {
        after: handleListAfter,
      },
      approve: {
        actionType: 'record',
        icon: 'Check',
        component: components.ApproveInvoice,
        variant: 'success',
        handler: handleApprove,
        isVisible: handleInvoiceActionIsVisible,
      },
      reject: {
        actionType: 'record',
        icon: 'cross',
        component: components.RejectInvoice,
        variant: 'danger',
        handler: handleReject,
        isVisible: handleInvoiceActionIsVisible,
      },
    },
    properties: {
      numberOfPoints: {
        isVisible: {
          list: true,
          filter: false,
          show: true,
        },
        isDisabled: true,
      },
      userName: {
        isVisible: { list: true, show: true, edit: false, filter: false },
        isDisabled: true,
      },
      pointTransactionId: {
        type: 'reference',
        reference: POINT_TRANSACTION_RESOURCE_ID,
        isDisabled: true,
        isVisible: {
          edit: false,
          show: true,
        },
      },
      userId: {
        reference: USER_RESOURCE_ID,
        isDisabled: true,
        isVisible: {
          edit: false,
          show: true,
          list: true,
        },
      },
      createdAt: {
        isVisible: {
          list: false,
          show: true,
        },
      },
      invoice: {
        components: {
          show: components.ImagePreview,
        },
        description: 'Scanned invoice',
        isVisible: {
          edit: false,
          show: true,
        },
      },
      status: {
        isDisabled: true,
        isVisible: {
          edit: false,
          show: true,
          list: true,
        },
      },
    },
  },
  features: [targetRelationSettingsFeature(), loggerFeatureSetup()],
});
