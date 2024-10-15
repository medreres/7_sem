import { envConfig } from './schema.js';

export const firebaseConfig = {
  projectId: envConfig.FIREBASE_PROJECT_ID,
  privateKey: envConfig.FIREBASE_PRIVATE_KEY,
  clientEmail: envConfig.FIREBASE_CLIENT_EMAIL,
};
