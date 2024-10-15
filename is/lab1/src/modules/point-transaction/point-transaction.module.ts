import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PointTransactionEntity } from './entities/point-transaction.entity.js';
import { PointTransactionController } from './point-transaction.controller.js';
import { PointTransactionService } from './point-transaction.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([PointTransactionEntity])],
  providers: [PointTransactionService],
  exports: [PointTransactionService],
  controllers: [PointTransactionController],
})
export class PointTransactionModule {}
