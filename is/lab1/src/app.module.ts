import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { SentryModule } from '@sentry/nestjs/setup';

import { AppController } from './app.controller.js';
import { AdminModule } from './modules/admin/admin.module.js';
import { AttachmentModule } from './modules/attachment/attachment.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { CategoryModule } from './modules/category/category.module.js';
import { CryptoModule } from './modules/crypto/crypto.module.js';
import { DbModule } from './modules/db/db.module.js';
import { FileModule } from './modules/file/file.module.js';
import { InvoiceModule } from './modules/invoice/invoice.module.js';
import { MailingModule } from './modules/mailing/mailing.module.js';
import { NotificationModule } from './modules/notification/notification.module.js';
import { PointTransactionModule } from './modules/point-transaction/point-transaction.module.js';
import { ProductModule } from './modules/product/product.module.js';
import { RewardModule } from './modules/reward/reward.module.js';
import { ShopModule } from './modules/shop/shop.module.js';
import { SupportModule } from './modules/support/support.module.js';
import { UserModule } from './modules/user/user.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      cache: true,
    }),
    SentryModule.forRoot(),
    AdminModule,
    DbModule,
    AuthModule,
    UserModule,
    ProductModule,
    CryptoModule,
    CategoryModule,
    MailingModule,
    SupportModule,
    ShopModule,
    ScheduleModule.forRoot(),
    InvoiceModule,
    FileModule,
    AttachmentModule,
    PointTransactionModule,
    EventEmitterModule.forRoot(),
    RewardModule,
    NotificationModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
