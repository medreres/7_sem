declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ACCESS_TOKEN_SECRET: string;
      ADMIN_EMAIL: string;
      ADMIN_PASSWORD: string;
      APP_PORT: number;
      DATABASE_HOST: 'string';
      DATABASE_NAME: string;
      DATABASE_PASSWORD: string;
      DATABASE_PORT: number;
      DATABASE_TYPE: 'postgres';
      DATABASE_URL: string;
      DATABASE_USERNAME: string;
      NODE_ENV: import('modules/config/schema.ts').NodeEnv;
      ADMINJS_PRIVATE_KEY: string;
      AWS_ACCESS_KEY: string;
      AWS_SECRET_ACCESS_KEY: string;
      AWS_REGION: string;
      AWS_SENDER_EMAIL: string;
      AWS_BUCKET_NAME: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
