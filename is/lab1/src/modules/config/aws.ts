import { envConfig } from './schema.js';

export const awsConfig = {
  accessKey: envConfig.AWS_ACCESS_KEY,
  secretAccessKey: envConfig.AWS_SECRET_ACCESS_KEY,
  senderEmail: envConfig.AWS_SENDER_EMAIL,
  region: envConfig.AWS_REGION,
  bucketName: envConfig.AWS_BUCKET_NAME,
  uploadLinkExpirationTimeInSeconds: 3600,
};
