import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';

import { CreateUploadLinkParams } from './types/create-upload-link.js';

import { awsConfig } from '../config/aws.js';

@Injectable()
export class FileService {
  private readonly client: S3Client;

  constructor() {
    this.client = new S3Client({
      region: awsConfig.region,
      credentials: {
        accessKeyId: awsConfig.accessKey,
        secretAccessKey: awsConfig.secretAccessKey,
      },
    });
  }

  async createUploadLink(params: CreateUploadLinkParams): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: awsConfig.bucketName,
      Key: params.path,
    });

    const uploadUrl = await getSignedUrl(this.client, command, {
      expiresIn: awsConfig.uploadLinkExpirationTimeInSeconds,
    });

    return uploadUrl;
  }

  buildFileUrl(filePath: string): string {
    if (filePath.includes('http')) {
      return filePath;
    }

    return `https://${awsConfig.bucketName}.s3.${awsConfig.region}.amazonaws.com/${filePath}`;
  }
}
