import * as AdminJSTypeorm from '@adminjs/typeorm';
import { Module } from '@nestjs/common';
import AdminJS from 'adminjs';

import { provider } from './auth-provider.js';
import { adminOptions } from './options.js';

AdminJS.registerAdapter({
  Resource: AdminJSTypeorm.Resource,
  Database: AdminJSTypeorm.Database,
});

// TODO store admin session in db
@Module({
  imports: [
    // eslint-disable-next-line @typescript-eslint/naming-convention -- lib's property
    import('@adminjs/nestjs').then(({ AdminModule }) =>
      AdminModule.createAdminAsync({
        useFactory: () => {
          return {
            adminJsOptions: adminOptions,
            // auth: {
            //   cookieName: 'adminjs',
            //   cookiePassword: 'adminjs',
            //   provider,
            // },
            // sessionOptions: {
            //   resave: true,
            //   saveUninitialized: true,
            //   secret: 'secret',
            // },
          };
        },
      }),
    ),
  ],
})
export class AdminModule {}
