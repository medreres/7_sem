import { targetRelationSettingsFeature } from '@adminjs/relations';

import { loggerFeatureSetup } from './log/feature.js';
import { CATEGORY_RESOURCE_ID } from './product/category.resource.js';
import { PRODUCT_RESOURCE_ID } from './product/product/product.resource.js';
import { REWARD_RESOURCE_ID } from './rewards/reward.resource.js';
import { INVOICE_RESOURCE_ID } from './user/invoice/invoice.resource.js';

import { AttachmentEntity } from '../../attachment/entities/attachment.entity.js';
import { Resource } from '../types/resource.js';

export const ATTACHMENT_RESOURCE_ID = 'Attachments';

export const createAttachmentResource = (): Resource<AttachmentEntity> => ({
  resource: AttachmentEntity,
  options: {
    navigation: {
      name: 'Attachments',
      icon: 'File',
    },
    id: ATTACHMENT_RESOURCE_ID,
    properties: {
      fileUrl: {
        isRequired: true,
        props: {
          type: 'url',
        },
        isVisible: {
          list: false,
          filter: false,
          show: true,
          edit: true,
        },
      },
      categoryId: {
        reference: CATEGORY_RESOURCE_ID,
      },
      rewardId: {
        reference: REWARD_RESOURCE_ID,
      },
      productId: {
        reference: PRODUCT_RESOURCE_ID,
      },
      invoiceId: {
        reference: INVOICE_RESOURCE_ID,
      },
    },
  },
  features: [targetRelationSettingsFeature(), loggerFeatureSetup()],
});
