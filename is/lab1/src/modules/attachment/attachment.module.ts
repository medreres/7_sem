import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AttachmentService } from './attachment.service.js';
import { AttachmentEntity } from './entities/attachment.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([AttachmentEntity])],
  providers: [AttachmentService],
  exports: [AttachmentService],
})
export class AttachmentModule {}
