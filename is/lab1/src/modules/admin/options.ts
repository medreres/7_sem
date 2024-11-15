import AdminJS, { AdminJSOptions } from 'adminjs';

import { componentLoader, components } from './components/index.js';
import resources from './resources/index.js';

import { UserEntity } from '../user/entities/user.entity.js';

export const adminOptions: AdminJSOptions = {
  componentLoader,
  rootPath: '/admin',
  resources: resources.map((resource) => resource()),
  branding: {
    companyName: 'IPS-41',
    logo: 'https://www.google.com/u/0/ac/images/logo.gif?uid=100029193258489271529&service=google_gsuite',
    favicon:
      'https://lh5.googleusercontent.com/proxy/5rC6f4VPyTT0ObNLggYn48Jg60BEh60qPWZAt4n7nKplWHPxrOe5M-F82iyRuGRUhhs-FkO-SlLwsrY-bxA2htE7tD9rzA6xsHnrAN_Z5jsxiOlVYx9NCUuq',
  },
  dashboard: {
    handler: async () => {
      // Query the database for the user count
      const userCount = await UserEntity.count(); // Sequelize example, adapt as per ORM

      const users = await UserEntity.find({});

      // Prepare data for the chart
      const pointsData = users.map((user) => ({
        name: `${user.firstName} ${user.lastName}`,
        points: user.pointsAmount,
      }));

      console.log('pointsData', pointsData);

      return { userCount, pointsData };
    },
    component: components.Dashboard,
  },
  // pages: {
  //   dashboard: {
  //     component: components.Dashboard,
  //   },
  // },
};
