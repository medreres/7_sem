import { DefaultAuthProvider } from 'adminjs';

import { authenticate } from './authenticate.js';
import { componentLoader } from './components/index.js';

export const provider = new DefaultAuthProvider({
  componentLoader,
  authenticate,
});
