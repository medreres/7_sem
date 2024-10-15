import { AttachmentEntity } from '../attachment/entities/attachment.entity.js';
import { ResetPasswordCodeEntity } from '../auth/entities/resset-password.entity.js';
import { CategoryEntity } from '../category/entities/category.entity.js';
import { SubCategoryEntity } from '../category/entities/sub-category.entity.js';
import { SubSubCategoryEntity } from '../category/entities/sub-sub-category.entity.js';
import { InvoiceEntity } from '../invoice/entities/invoice.entity.js';
import { LogEntity } from '../logs/entities/log.entity.js';
import { NotificationEntity } from '../notification/entities/notification.entity.js';
import { PointTransactionEntity } from '../point-transaction/entities/point-transaction.entity.js';
import { ProductEntity } from '../product/entities/product.entity.js';
import { ProductCharacteristicEntity } from '../product/entities/product-characteristic.entity.js';
import { ClaimEntity } from '../reward/entities/claim.entity.js';
import { RewardEntity } from '../reward/entities/reward.entity.js';
import { ShopEntity } from '../shop/entities/shop.entity.js';
import { UserEntity } from '../user/entities/user.entity.js';
import { UserStatusEntity } from '../user/entities/user-status.entity.js';

export const entities = [
  UserEntity,
  UserStatusEntity,
  ResetPasswordCodeEntity,
  PointTransactionEntity,
  CategoryEntity,
  SubCategoryEntity,
  SubSubCategoryEntity,
  ProductEntity,
  ProductCharacteristicEntity,
  RewardEntity,
  ClaimEntity,
  AttachmentEntity,
  InvoiceEntity,
  LogEntity,
  ShopEntity,
  NotificationEntity,
];
