import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AttachmentEntity } from './entities/attachment.entity.js';
import { AttachmentResource } from './types/attachment-resource.js';
import { CreateAttachmentParams } from './types/create-attachment.js';
import { GetAttachmentByResourceParams } from './types/get-attachment-by-resource.js';
import { UpdateAttachmentParams } from './types/update-attachment.js';

@Injectable()
export class AttachmentService {
  private logger = new Logger(AttachmentService.name);

  constructor(
    @InjectRepository(AttachmentEntity)
    private readonly attachmentRepository: Repository<AttachmentEntity>,
  ) {}

  async createAttachment(
    data: CreateAttachmentParams,
  ): Promise<AttachmentEntity> {
    return this.attachmentRepository.save(data);
  }

  async getAttachmentByResourceId(
    data: GetAttachmentByResourceParams,
  ): Promise<AttachmentEntity | null> {
    return this.attachmentRepository.findOne({ where: data });
  }

  async getAttachmentByResourceIdOrFail(
    params: GetAttachmentByResourceParams,
  ): Promise<AttachmentEntity> {
    return this.attachmentRepository.findOneOrFail({ where: params });
  }

  async updateAttachmentByResourceId(
    params: UpdateAttachmentParams,
  ): Promise<AttachmentEntity> {
    const { fileUrl, ...ids } = params;

    await this.attachmentRepository.update(ids, { fileUrl });

    return this.getAttachmentByResourceIdOrFail(ids);
  }

  async createOrUpdateExistingAttachment(
    ids: AttachmentResource,
    fileUrl: string,
  ): Promise<void> {
    const attachment = await this.getAttachmentByResourceId(ids);

    if (attachment) {
      this.logger.debug('Updating attachment for new url...');

      await this.updateAttachmentByResourceId({
        ...ids,
        fileUrl,
      });
    } else {
      this.logger.debug('Creating new attachment...');
      await this.createAttachment({
        ...ids,
        fileUrl,
      });
    }
  }
}
