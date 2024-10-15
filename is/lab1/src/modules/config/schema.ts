import { array, InferType, number, object, string } from 'yup';

export enum NodeEnv {
  Production = 'production',
  Staging = 'staging',
  Development = 'development',
  Local = 'local',
  Test = 'test',
}

const envConfigSchema = object({
  NODE_ENV: string().oneOf(Object.values(NodeEnv)),
  PORT: number().default(3000),

  ACCESS_TOKEN_SECRET: string().required(),

  DATABASE_URL: string().required(),

  SENTRY_DSN: string().required(),

  ADMINJS_PRIVATE_KEY: string().required(),

  AWS_ACCESS_KEY: string().required(),
  AWS_SECRET_ACCESS_KEY: string().required(),
  AWS_REGION: string().required(),
  AWS_SENDER_EMAIL: string().required(),
  AWS_BUCKET_NAME: string().required(),

  SUPPORT_EMAIL: string().email().required(),

  FIREBASE_PROJECT_ID: string().required(),
  FIREBASE_PRIVATE_KEY: string().required(),
  FIREBASE_CLIENT_EMAIL: string().email().required(),

  LIFETIME_POINTS_LIFETIME_IN_MS: number().required(),
  LIFETIME_POINTS_BEFORE_EXPIRY_NOTIFICATION_TIME_RANGES: array()
    .transform((value: string) => value.split(','))
    .of(number().required())
    .required(),
  ADMIN_EMAIL: string(),
  ADMIN_PASSWORD: string(),
});

// parse and assert validity
export const envConfig = envConfigSchema.validateSync(process.env);

export type Config = InferType<typeof envConfigSchema>;
