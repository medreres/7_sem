import { targetRelationSettingsFeature } from '@adminjs/relations';

import { handleDeletePointTransaction } from './handlers/delete-point-transaction.handler.js';
import { handleNewPointTransaction } from './handlers/handle-new-point-trasaction.js';

import { PointTransactionEntity } from '../../../../point-transaction/entities/point-transaction.entity.js';
import { pointsInputProps } from '../../../components/points-input.props.js';
import { Resource } from '../../../types/resource.js';
import { loggerFeatureSetup } from '../../log/feature.js';
import { INVOICE_RESOURCE_ID } from '../invoice/invoice.resource.js';
import { navigation } from '../navigation.js';
import { USER_RESOURCE_ID } from '../user/user.resource.js';

export const POINT_TRANSACTION_RESOURCE_ID = 'Points';

export const createPointTransactionResource =
  (): Resource<PointTransactionEntity> => ({
    resource: PointTransactionEntity,
    options: {
      navigation,
      id: POINT_TRANSACTION_RESOURCE_ID,
      actions: {
        new: {
          handler: handleNewPointTransaction,
        },
        delete: { handler: handleDeletePointTransaction },
        edit: {
          isAccessible: false,
        },
      },
      properties: {
        amount: {
          isRequired: true,
          props: pointsInputProps,
        },
        description: {
          isRequired: true,
        },
        userId: {
          reference: USER_RESOURCE_ID,
          isVisible: {
            edit: true,
            filter: true,
            list: true,
            show: true,
          },
          isRequired: true,
        },
        invoiceId: {
          reference: INVOICE_RESOURCE_ID,
          isVisible: {
            edit: false,
          },
        },
        createdAt: {
          isVisible: {
            show: true,
            list: true,
          },
        },
        updatedAt: {
          isVisible: {
            list: false,
          },
        },
      },
    },
    features: [targetRelationSettingsFeature(), loggerFeatureSetup()],
  });
