import { AdminJSOptions } from 'adminjs';

import { componentLoader } from './components/index.js';
import resources from './resources/index.js';

export const adminOptions: AdminJSOptions = {
  componentLoader,
  rootPath: '/admin',
  resources: resources.map((resource) => resource()),
  databases: [],
  branding: {
    companyName: 'Hispec',
  },
};
