import passwordsFeature from '@adminjs/passwords';
import {
  owningRelationSettingsFeature,
  RelationType,
} from '@adminjs/relations';

import { handleNew } from './handle-new.js';
import { ExtendedUser } from './types.js';

import { adminConfig } from '../../../../config/admin.js';
import { InvoiceEntity } from '../../../../invoice/entities/invoice.entity.js';
import { PointTransactionEntity } from '../../../../point-transaction/entities/point-transaction.entity.js';
import { ClaimEntity } from '../../../../reward/entities/claim.entity.js';
import { UserEntity } from '../../../../user/entities/user.entity.js';
import { componentLoader } from '../../../components/index.js';
import { Resource } from '../../../types/resource.js';
import { validateUser } from '../../../utils/validate-user.js';
import { loggerFeatureSetup } from '../../log/feature.js';
import { CLAIM_RESOURCE_ID } from '../claim/claim.resource.js';
import { INVOICE_RESOURCE_ID } from '../invoice/invoice.resource.js';
import { navigation } from '../navigation.js';
import { POINT_TRANSACTION_RESOURCE_ID } from '../point-transaction/point-transaction.resource.js';
import { USER_STATUS_RESOURCE_ID } from '../user-status.resource.js';

export const USER_RESOURCE_ID = 'User List';

export const createUserResource = (): Resource<ExtendedUser> => ({
  resource: UserEntity,
  options: {
    actions: {
      new: {
        handler: handleNew,
      },
      edit: {
        before: [validateUser],
      },
    },
    id: USER_RESOURCE_ID,
    navigation,
    listProperties: [
      'id',
      'email',
      'firstName',
      'lastName',
      'role',
      'isActive',
      'dateOfBirth',
      'phone',
      'businessName',
    ] satisfies (keyof UserEntity)[], // TODO add typescript for this
    properties: {
      phone: {
        type: 'phone',
        isRequired: true,
      },
      pointsAmount: {
        isVisible: true,
        isDisabled: true,
      },
      password: {
        isVisible: false,
      },
      email: { isRequired: true, props: { type: 'email' } },
      firstName: { isRequired: true },
      lastName: { isRequired: true },
      businessName: { isRequired: true },
      city: { isRequired: true },
      postalCode: { isRequired: true },
      address: { isRequired: true },
      statusId: {
        isId: true,
        isRequired: true,
        type: 'reference',
        reference: USER_STATUS_RESOURCE_ID,
        props: { type: 'number' },
      },
      role: { isRequired: true },
      isActive: { isRequired: true },
      lastResetPointsAt: {
        isDisabled: true,
      },
    },
  },
  features: [
    passwordsFeature({
      componentLoader,
      properties: {
        // * New virtual field newPassword will be created, this field will be passed to handleNew or validateUser where it will be hashed
        encryptedPassword: 'password',
        password: 'newPassword',
      },
      // * Password is hashed in validateUser function
      hash: (password) => password,
    }),
    owningRelationSettingsFeature({
      componentLoader,
      licenseKey: adminConfig.privateKey,
      relations: {
        points: {
          type: RelationType.OneToMany,
          target: {
            joinKey: 'userId' satisfies keyof PointTransactionEntity,
            resourceId: POINT_TRANSACTION_RESOURCE_ID,
          },
        },
        invoices: {
          type: RelationType.OneToMany,
          target: {
            joinKey: 'userId' satisfies keyof InvoiceEntity,
            resourceId: INVOICE_RESOURCE_ID,
          },
        },
        claims: {
          type: RelationType.OneToMany,
          target: {
            joinKey: 'userId' satisfies keyof ClaimEntity,
            resourceId: CLAIM_RESOURCE_ID,
          },
        },
      },
    }),
    loggerFeatureSetup(),
  ],
});
