import { envConfig } from './schema.js';

export const authConfig = {
  accessTokenSecret: envConfig.ACCESS_TOKEN_SECRET,
  resetCodeLifeInDays: 7,
};
